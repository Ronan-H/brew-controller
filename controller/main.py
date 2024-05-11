import asyncio
import os
import signal
from quart import Quart, jsonify, request
from quart_cors import cors

from brew_controller import BrewController

# Run command: python main.py

app = Quart(__name__)
cors(app)

INITIAL_TARGET_TEMP = 19
INITIAL_THRESHOLD = 0.1
INITIAL_VESSEL_OFFSET = 0.0
UPDATE_INTERVAL_SEC = 30
SERIALIZED_BC_PATH = './controller-settings.dat'

brew_controller = None

try:
    brew_controller = BrewController.init_from_file(SERIALIZED_BC_PATH)
except:
    brew_controller = BrewController(INITIAL_TARGET_TEMP, INITIAL_THRESHOLD, INITIAL_VESSEL_OFFSET)
    brew_controller.write_settings_to_file(SERIALIZED_BC_PATH)

exiting = False

def init_app():

    @app.route("/test")
    async def test():
        return 'TEST'

    @app.route("/status")
    async def status():
        return jsonify(
            heater_on=brew_controller.is_heater_on(),
            vessel_temp=brew_controller.query_vessel_temp(),
            room_temp=brew_controller.query_room_temp(),
            target_vessel_temp=brew_controller.target_temp,
            vessel_temp_threshold=brew_controller.temp_threshold,
            vessel_temp_offset=brew_controller.get_vessel_offset()
        )

    @app.route("/target", methods=["PUT"])
    async def target():
        request_json = await request.json

        if 'target_vessel_temp' in request_json:
            brew_controller.target_temp = float(request_json['target_vessel_temp'])

        if 'vessel_temp_threshold' in request_json:
            brew_controller.temp_threshold = float(request_json['vessel_temp_threshold'])

        if 'vessel_temp_offset' in request_json:
            brew_controller.set_vessel_offset(float(request_json['vessel_temp_offset']))

        brew_controller.write_settings_to_file(SERIALIZED_BC_PATH)

        return await status()

init_app()


async def run_controller_loop():
    while not exiting:
        await brew_controller.update()
        await asyncio.sleep(UPDATE_INTERVAL_SEC)


async def run_app_async():
    await brew_controller.init_meross_plug()

    await asyncio.gather(app.run_task(host='0.0.0.0', port=5000), run_controller_loop())
    

# TODO: Get cleanup on exit working properly
# @atexit.register
def shutdown(signal, frame):
    global exiting

    print('Shutting down...')
    exiting = True
    # asyncio.run(brew_controller.cleanup_fn())

signal.signal(signal.SIGINT, shutdown)

if __name__ == '__main__':
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    loop = asyncio.new_event_loop()
    loop.run_until_complete(run_app_async())
