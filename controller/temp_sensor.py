from abc import ABC, abstractmethod
from os import path
import time

INITIAL_LAST_READING = 18

class TempSensor(ABC):

    def __init__(self):
        self.last_reading = INITIAL_LAST_READING

    @abstractmethod
    def get_temp(self):
        pass

    def get_temp_with_retry(self, heater_on, max_retries):
        for i in range(max_retries):
            try:
                temp = self.get_temp(heater_on)
                self.last_reading = temp
                return temp 
            except:
                print(f'Failed to read temperature after {i} attempts')
                time.sleep(1)
        
        print('Reached max retries to read temperature, returning previous reading of: ', self.last_reading)
        return self.last_reading


class MockTempSensor(TempSensor):
  def __init__(self, initial_reading, delta):
      super().__init__()
      self.last_reading = initial_reading
      self.delta = delta

  def get_temp(self, heater_on):
        if heater_on:
            self.last_reading += self.delta
        else:
            self.last_reading -= self.delta

        return self.last_reading
  
sensor_base_path = '/sys/bus/w1/devices/'
sensor_file_name = 'temperature'

class RealTempSensor(TempSensor):
    def __init__(self, sensor_id):
        super().__init__()
        self.sensor_id = sensor_id

    def get_temp(self, _heater_on):
        sensor_file_path = path.join(sensor_base_path, self.sensor_id, sensor_file_name)

        with open(sensor_file_path) as f:
            temp_str = f.readline()

            temp_float = float(f'{temp_str[:2]}.{temp_str[2:]}')

            return temp_float

# MockTempSensor.register(TempSensor)
# RealTempSensor.register(TempSensor)
