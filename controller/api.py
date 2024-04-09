from flask import Flask, jsonify, request
import random
from flask_cors import CORS

# Run command: flask --app api run --host=0.0.0.0

def clamp(n, smallest, largest):
    return max(smallest, min(n, largest))

app = Flask(__name__)
CORS(app)

is_heater_on = True
cur_vessel_temp = 15
cur_room_temp = 18
target_vessel_temp = 20
vessel_temp_threshold = 0.2

# For mocking
target_temp = 20
temp_threshold = 0.3
max_temp = target_temp + temp_threshold
min_temp = target_temp - temp_threshold

@app.route("/status")
def status():
    # Simultaed mock data for now
    global is_heater_on
    global cur_vessel_temp
    global cur_room_temp
    
    cur_room_temp = clamp(cur_room_temp + random.uniform(-0.5, 0.5), 14, 19)
    eventual_vessel_temp = cur_room_temp + (7 if is_heater_on else 0)

    vessel_room_diff = eventual_vessel_temp - cur_vessel_temp

    cur_vessel_temp += (vessel_room_diff / 60)

    if cur_vessel_temp < min_temp:
        is_heater_on = True
    elif cur_vessel_temp > max_temp:
        is_heater_on = False

    return jsonify(
        heater_on=is_heater_on,
        vessel_temp=cur_vessel_temp,
        room_temp=cur_room_temp,
        target_vessel_temp=target_vessel_temp,
        vessel_temp_threshold=vessel_temp_threshold,
    )

@app.route("/target", methods=["PUT"])
def target():
    global target_vessel_temp
    global vessel_temp_threshold

    if 'target_vessel_temp' in request.json:
        target_vessel_temp = float(request.json['target_vessel_temp'])

    if 'vessel_temp_threshold' in request.json:
        vessel_temp_threshold = float(request.json['vessel_temp_threshold'])

    return status()
