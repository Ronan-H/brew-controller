import config

from meross_iot.http_api import MerossHttpClient
from meross_iot.manager import MerossManager

import mocks

import time

INITIAL_LAST_READING = 18

class BrewController:
    def __init__(self, target_temp, temp_threshold, vessel_offset):
        self.target_temp = target_temp
        self.temp_threshold = temp_threshold
        self.vessel_offset = vessel_offset

        self.last_vessel_temp = INITIAL_LAST_READING
        self.last_room_temp = INITIAL_LAST_READING
        
        self.heater_plug = None
        self.error_message = None

        self.last_update_epoch = 0
    
    @staticmethod
    def init_from_file(file_path):
        with open(file_path) as f:
            fields = (float(n) for n in f.readline().split(','))
            return BrewController(*fields)
        
    def write_settings_to_file(self, file_path):
        with open(file_path, 'w') as f:
            f.write(f'{self.target_temp},{self.temp_threshold},{self.vessel_offset}\n')

    def is_heater_on(self):
        return self.heater_plug.is_on()
    
    def set_vessel_offset(self, offset):
        self.vessel_offset = offset

    async def init_meross_plug(self):
        if mocks.enabled:
            self.heater_plug = mocks.MockMerossDevice()
        else:
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
                raise Exception('No mss210n plugs found...')
            else:
                # Turn it on channel 0
                dev = plugs[0]

                # The first time we play with a device, we must update its status
                await dev.async_update()

                self.heater_plug = dev
    
    async def update(self, vessel_temp, room_temp):
        is_heater_on = self.is_heater_on()

        with open('temp-history.csv', 'a') as f:
            f.write(f'{self.target_temp},{self.temp_threshold},{is_heater_on},{vessel_temp},{room_temp}\n')

        max_temp = self.target_temp + self.temp_threshold
        min_temp = self.target_temp - self.temp_threshold

        print('Current vessel temp:', vessel_temp, flush=True)
        print('  Heater is on? - ', is_heater_on)
        print('  Min acceptable temp: ', min_temp)
        print('  Max acceptable temp: ', max_temp)

        if vessel_temp > max_temp:
            if is_heater_on:
                print('  Turning heater off')
                try:
                    await self.heater_plug.async_turn_off(channel=0)
                except:
                    self.error_message = 'Failed to turn heater off. Continuing...'
        elif vessel_temp < min_temp:
            if not is_heater_on:
                print('  Turning heater on')
                try:
                    await self.heater_plug.async_turn_on(channel=0)
                except:
                    self.error_message = 'Failed to turn heater on. Continuing...'
                
        else:
            print('  No action.')
        
        self.last_vessel_temp = vessel_temp
        self.last_room_temp = room_temp

        self.last_update_epoch = time.time()
