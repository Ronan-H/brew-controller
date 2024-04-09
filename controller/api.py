from flask import Flask, jsonify, request

app = Flask(__name__)

is_heater_on = True
cur_vessel_temp = 15
cur_room_temp = 18
target_vessel_temp = 20
vessel_temp_threshold = 0.2

@app.route("/status")
def status():
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
