from abc import ABC, abstractmethod
from os import path

class TempSensor:

    @abstractmethod
    def get_temp(self):
        pass


class MockTempSensor(ABC):
  def __init__(self, initial_reading, delta):
      self.last_reading = initial_reading
      self.delta = delta

  def get_temp(self, heater_on):
        if heater_on:
            self.last_reading += self.delta
        else:
            self.last_reading -= self.delta

        return self.last_reading
  
sensor_base_path = '/sys/bus/w1/devices/'
sensor_file_name = 'w1_slave'

class RealTempSensor(ABC):
    def __init__(self, sensor_id):
        self.sensor_id = sensor_id

    def get_temp(self, _heater_on):
        sensor_file_path = path.join(sensor_base_path, self.sensor_id, sensor_file_name)

        with open(sensor_file_path) as f:
            lines = f.readlines()
            assert len(lines) == 2

            temp_str = lines[1].split('t=')[1] # something like 12345 (= 12.345 degrees)
            temp_float = float(f'{temp_str[:2]}.{temp_str[2:]}')

            return temp_float

MockTempSensor.register(TempSensor)
RealTempSensor.register(TempSensor)
