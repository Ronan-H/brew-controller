from abc import ABC, abstractmethod

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
  

class RealTempSensor(ABC):
  def get_temp(self):
        # TODO: implement with the real hardware
        pass

MockTempSensor.register(TempSensor)
RealTempSensor.register(TempSensor)
