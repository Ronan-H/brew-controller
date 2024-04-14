import asyncio
import os
import config

from meross_iot.http_api import MerossHttpClient
from meross_iot.manager import MerossManager

from temp_sensor import MockTempSensor

target_temp = 20
temp_threshold = 0.3

max_temp = target_temp + temp_threshold
min_temp = target_temp - temp_threshold

temp_sensor = MockTempSensor(19, 0.1)

async def main():
    # Asia-Pacific: "iotx-ap.meross.com"
    # Europe: "iotx-eu.meross.com"
    # US: "iotx-us.meross.com"
    http_api_client = await MerossHttpClient.async_from_user_password(api_base_url='https://iotx-eu.meross.com',
                                                                      email=config.MEROSS_EMAIL, 
                                                                      password=config.MEROSS_PASSWORD)

    # Setup and start the device manager
    manager = MerossManager(http_client=http_api_client)
    await manager.async_init()

    # Retrieve all the mss210n devices that are registered on this account
    await manager.async_device_discovery()
    plugs = manager.find_devices(device_type="mss210n")

    if len(plugs) < 1:
        print("No mss210n plugs found...")
    else:
        # Turn it on channel 0
        dev = plugs[0]

        # The first time we play with a device, we must update its status
        await dev.async_update()

        while True:
            vessel_temp = temp_sensor.get_temp(dev.is_on())

            print('Current vessel temp:', vessel_temp, flush=True)
            print('  Heater is on:', dev.is_on())

            if vessel_temp > max_temp:
                if dev.is_on():
                    print('Too hot - turning heater off')
                    await dev.async_turn_off(channel=0)
            elif vessel_temp < min_temp:
                if not dev.is_on():
                    print('Too cold - turning heater on')
                    await dev.async_turn_on(channel=0)
            else:
                print('No action.')
            
            await asyncio.sleep(1)

    print('Exiting...')
    # Close the manager and logout from http_api
    manager.close()
    await http_api_client.async_logout()


if __name__ == '__main__':
    # Windows and python 3.8 requires to set up a specific event_loop_policy.
    #  On Linux and MacOSX this is not necessary.
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.stop()