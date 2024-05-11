
from os import path
import time

# Sensors:
# 1. /sys/bus/w1/devices/28-b5fa691f64ff - No tape, for vessel temp
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


sensors = ('28-2acb691f64ff', '28-b5fa691f64ff')

while True:
    for s in sensors:
        try:
            print(read_sensor(s))
        except:
            print('Failed on sensor:', s)
