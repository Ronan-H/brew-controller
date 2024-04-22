
from os import path

# Sensors:
# 1. /sys/bus/w1/devices/28-d7f9691f64ff - No tape, for vessel temp
# 1. /sys/bus/w1/devices/28-2acb691f64ff - Red tape, for room temp

base_path = '/sys/bus/w1/devices/'
file_path = 'w1_slave'

def read_sensor(sensor_id):
    sensor_file_path = path.join(base_path, sensor_id, file_path)

    with open(sensor_file_path) as f:
        lines = f.readlines()
        assert len(lines) == 2

        temp_str = lines[1].split('t=')[1] # something like 12345 (= 12.345 degrees)
        temp_float = float(f'{temp_str[:2]}.{temp_str[2:]}')

        return temp_float


print(read_sensor('28-2acb691f64ff'))
print(read_sensor('28-d7f9691f64ff'))
