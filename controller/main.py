import asyncio
import os
import serial
from quart import Quart, jsonify, request, Response
from quart_cors import cors

from brew_controller import BrewController

import mocks
import random

from temp_correction import get_corrected_values, TempSmoother

# Run command: python main.py

app = Quart(__name__)
cors(app)

INITIAL_TARGET_TEMP = 19
SERIALIZED_BC_PATH = './controller-settings.dat'

brew_controller = None

try:
    brew_controller = BrewController.init_from_file(SERIALIZED_BC_PATH)
except:
    brew_controller = BrewController(INITIAL_TARGET_TEMP)
    brew_controller.write_settings_to_file(SERIALIZED_BC_PATH)


def init_app():

    @app.route("/test")
    async def test():
        return 'TEST'

    @app.route("/status")
    async def get_status():
        return jsonify(
            heater_on=brew_controller.is_heater_on(),
            vessel_temp=round(brew_controller.last_vessel_temp, 3),
            room_temp=round(brew_controller.last_room_temp, 3),
            last_update_epoch=round(brew_controller.last_update_epoch, 3)
        )

    @app.route("/target", methods=["GET"])
    async def get_target():
        return jsonify(
            target_vessel_temp=brew_controller.target_temp,
        )

    @app.route("/target", methods=["PUT"])
    async def put_target():
        request_json = await request.json

        if 'target_vessel_temp' in request_json:
            brew_controller.target_temp = float(request_json['target_vessel_temp'])

        brew_controller.write_settings_to_file(SERIALIZED_BC_PATH)

        return Response(status=200)

    @app.route("/error")
    async def get_error():
        return jsonify(
            message=brew_controller.error_message,
        )
    
    @app.route("/error", methods=["DELETE"])
    async def reset_error():
        brew_controller.error_message = None

        return Response(status=200)

init_app()


def init_serial():
    for i in range(4):
        try:
            ser = serial.Serial(f'/dev/ttyUSB{i}', 9600, timeout=1)
            ser.reset_input_buffer()
            return ser
        except:
            continue

    
    brew_controller.error_message = 'Failed to connect to the Arduino. Fix connections. Will re-init serial and keep polling...'
    return None


MIN_VALID_TEMP = 1
MAX_VALID_TEMP = 80

async def run_controller_loop():
    temp_smoothers = [TempSmoother(2, 2) for _ in range(2)]

    if mocks.enabled:
        while True:
            await brew_controller.update(19 + random.random() * 4, 17 + random.random() * 2)
            await asyncio.sleep(10)
    else:
        ser = init_serial()

        while True:
            # Putting this at the start of the loop so that continuing from errors doesn't skip the sleep
            await asyncio.sleep(1)

            if ser == None:
                ser = init_serial()

            bytes_remaining = 0

            try:
                bytes_remaining = ser.in_waiting
            except:
                brew_controller.error_message = 'Failed to read bytes from the Arduino. Will re-init serial and keep polling...'
                ser = None
                await brew_controller.update(99, 99)
                continue

            if bytes_remaining > 0:
                line = None
                temps = None
                try:
                    line = ser.readline().decode('utf-8').rstrip()
                    temps = [float(t) for t in line.split(',')]
                except:
                    brew_controller.error_message = 'Failed to parse temperature readings from the Arduino. Will re-init serial and keep polling...'
                    ser = None
                    await brew_controller.update(98, 98)
                    continue

                if len(temps) != 2 or \
                temps[0] < MIN_VALID_TEMP or temps[0] > MAX_VALID_TEMP or \
                temps[1] < MIN_VALID_TEMP or temps[1] > MAX_VALID_TEMP:
                    brew_controller.error_message = f'Got an invalid temperature reading: {line}. Will re-init serial and keep polling...'
                    ser = None
                    await brew_controller.update(97, 97)
                    continue

                corrected_values = get_corrected_values(temps)

                # Swap sensor values because I taped the wrong one to the vessel
                # TODO: Swap back, or fix any references to which sensor is which
                corrected_values = corrected_values[::-1]

                # Smooth sensor readings, to reduce random variance between readings
                smoothed_values = [temp_smoothers[i].get_next(corrected_values[i]) for i in range(2)]

                await brew_controller.update(*smoothed_values)


async def run_app_async():
    while True:
        try:
            await brew_controller.init_meross_plug()
            break
        except:
            print('Failed to init Meross plug.')
            print('Will sleep for 10s and try again...')
            await asyncio.sleep(10)

    await asyncio.gather(app.run_task(host='0.0.0.0', port=5000), run_controller_loop())
    

if __name__ == '__main__':
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    loop = asyncio.new_event_loop()
    loop.run_until_complete(run_app_async())
