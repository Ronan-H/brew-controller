
temps = [24.63, 24.57, 24.63, 24.57, 24.63, 24.63, 24.63, 24.63, 24.57, 24.57, 24.63, 24.63, 24.63, 24.63, 24.57, 24.57, 24.57, 24.57, 24.57, 24.57, 24.63, 24.63, 24.57, 24.63, 24.57, 24.51, 24.57, 24.57, 24.51, 24.57, 24.51, 24.51, 24.51, 24.57, 24.57, 24.51, 24.51, 24.51, 24.57, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.51, 24.45, 24.51, 24.51, 24.45, 24.51, 24.45, 24.51, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.51, 24.51, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.45, 24.38, 24.45, 24.38, 24.45, 24.38, 24.45, 24.45, 24.38, 24.45, 24.45, 24.45, 24.38, 24.45, 24.38, 24.38, 24.45, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.38, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.38, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.32, 24.26, 24.32, 24.26, 24.32, 24.26, 24.32, 24.26, 24.26, 24.32, 24.26, 24.32, 24.26, 24.26, 24.26, 24.26, 24.26, 24.26, 24.26, 24.26, 24.26, 24.26, 24.26, 24.26, 24.26, 24.26, 24.32, 24.26, 24.26, 24.2, 24.26, 24.26, 24.2, 24.2, 24.26, 24.26, 24.2, 24.26, 24.26, 24.26, 24.26, 24.2, 24.26, 24.26, 24.2, 24.2, 24.2, 24.2, 24.2, 24.26, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.13, 24.2, 24.2, 24.2, 24.13, 24.2, 24.13, 24.2, 24.13, 24.2, 24.2, 24.13, 24.13, 24.13, 24.2, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.2, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.13, 24.07, 24.13, 24.13, 24.13, 24.07, 24.13, 24.13, 24.13, 24.13]

ref = temps[0]
times_diff = 0
max_times_diff = 2
jump_diff = 0.1

smoothed = []

for t in temps:
    diff = abs(t - ref)

    if t == ref or diff >= jump_diff or times_diff >= max_times_diff:
        smoothed.append(t)
        times_diff = 0
        ref = t
    else:
        smoothed.append(ref)
        times_diff += 1

print(smoothed)