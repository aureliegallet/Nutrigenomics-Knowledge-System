from flask import Flask, render_template, request, jsonify
import json

knowledge_base = '../Flask/static/json/kb.json'

app = Flask(__name__)

@app.route("/")
def show_home():
    return render_template('home.html')

@app.route("/system")
def show_system():
    return render_template('system.html')

@app.route("/expert")
def show_expert():
    return render_template('expert.html')

@app.route("/knowledge")
def show_knowlegde():
    return render_template('knowledge.html')

@app.route('/add-to-kb', methods=['POST'])
def save_data():
    try:
        answer = request.get_json()
        print(answer)
        with open(knowledge_base, 'r') as json_file:
            knowledge = json.load(json_file)
        knowledge["Facts"].append(answer)
        with open(knowledge_base, 'w') as json_file:
            json.dump(knowledge, json_file, indent=4)
        return jsonify({'message': 'Answer saved successfully!'}), 200
    except Exception as e:
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500
