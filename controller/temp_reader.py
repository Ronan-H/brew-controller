#!/usr/bin/env python3
import serial

ref_high = 100.02
ref_low = 0
ref_range = ref_high - ref_low
sensor_values = [
    {
        'raw_high': 99.87,
        'raw_low': 0.37,
        'raw_range': 99.5,
    },
    {
        'raw_high': 100,
        'raw_low': 0.12,
        'raw_range': 99.88,
    }
]

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)
    ser.reset_input_buffer()
    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            raw_temps = [float(s) for s in line.split(',')]

            corrected = []

            for i in range(2):
                raw_value = raw_temps[i]

                values = sensor_values[i]
                raw_high = values['raw_high']
                raw_low = values['raw_low']
                raw_range = values['raw_range']
                corrected_value = (((raw_value - raw_low) * ref_range) / raw_range) + ref_low

                corrected.append(corrected_value)
            
            print(','.join(str(f'{f:.2f}') for f in (raw_temps + corrected)))

