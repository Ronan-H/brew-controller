
ref_high = 100.02
ref_low = 0
ref_range = ref_high - ref_low
sensor_values = [
    {
        'raw_high': 99.87,
        'raw_low': 0.37,
        'raw_range': 99.5,
        'second_adjust': -0.02
    },
    {
        'raw_high': 100,
        'raw_low': 0.12,
        'raw_range': 99.88,
        'second_adjust': 0.02
    }
]

def get_corrected_values(raw_values):
    corrected = []

    for i in range(2):
        raw_value = raw_values[i]

        values = sensor_values[i]
        raw_low = values['raw_low']
        raw_range = values['raw_range']
        corrected_value = (((raw_value - raw_low) * ref_range) / raw_range) + ref_low + values['second_adjust']

        corrected.append(corrected_value)
    
    return corrected