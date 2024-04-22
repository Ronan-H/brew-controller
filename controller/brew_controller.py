import config

from meross_iot.http_api import MerossHttpClient
from meross_iot.manager import MerossManager

from temp_sensor import MockTempSensor, RealTempSensor


class BrewController:
    def __init__(self, target_temp, temp_threshold):
        self.target_temp = target_temp
        self.temp_threshold = temp_threshold

        # self.vessel_sensor = MockTempSensor(target_temp - temp_threshold * 2, temp_threshold / 4)
        # self.room_sensor = MockTempSensor(target_temp - 3, 0)
        self.vessel_sensor = RealTempSensor('28-d7f9691f64ff') # no tape
        self.room_sensor = RealTempSensor('28-2acb691f64ff') # red tape
        
        self.heater_plug = None
        self.cleanup_fn = None
    
    @staticmethod
    def init_from_file(file_path):
        with open(file_path) as f:
            fields = (float(n) for n in f.readline().split(','))
            return BrewController(*fields)
        
    def write_settings_to_file(self, file_path):
        with open(file_path, 'w') as f:
            f.write(f'{self.target_temp},{self.temp_threshold}\n')

    def is_heater_on(self):
        return self.heater_plug.is_on()
    
    def get_vessel_temp(self):
        return self.vessel_sensor.get_temp(self.is_heater_on())
    
    def get_room_temp(self):
        return self.room_sensor.get_temp(self.is_heater_on())

    async def init_meross_plug(self):
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
            raise Exception('No mss210n plugs found...')
        else:
            # Turn it on channel 0
            dev = plugs[0]

            # The first time we play with a device, we must update its status
            await dev.async_update()

            self.heater_plug = dev

        async def cleanup():
            print('Closing Meross client...')
            manager.close()
            await http_api_client.async_logout()
        
        self.cleanup_fn = cleanup
    
    async def update(self):
        is_heater_on = self.is_heater_on()
        vessel_temp = self.vessel_sensor.get_temp(self.is_heater_on())

        max_temp = self.target_temp + self.temp_threshold
        min_temp = self.target_temp - self.temp_threshold

        print('Current vessel temp:', vessel_temp, flush=True)
        print('  Heater is on? - ', is_heater_on)

        if vessel_temp >= max_temp and is_heater_on:
            print('  Turning heater off')
            await self.heater_plug.async_turn_off(channel=0)
        elif vessel_temp <= min_temp and not is_heater_on:
            print('  Turning heater on')
            await self.heater_plug.async_turn_on(channel=0)
        else:
            print('  No action.')
