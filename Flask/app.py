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

@app.route('/get-score', methods=['GET'])
def get_score():
    try:
        with open(knowledge_base, 'r') as knowledge_base_file:
            knowledge = json.load(knowledge_base_file)
        score = knowledge["Score"]
        return jsonify({"Score": score}), 200
    except Exception as e:
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

@app.route('/add-to-kb', methods=['POST'])
def save_data():
    try:
        answer = request.get_json()
        with open(knowledge_base, 'r') as knowledge_base_file:
            knowledge = json.load(knowledge_base_file)
        knowledge["Facts"].append(answer)

        # Update score
        question = knowledge["Questions"].get(answer["questionKey"])
        knowledge["Score"] = knowledge["Score"] + question["points"].get(answer["option"])
        print(knowledge["Score"])

        # Write to file
        with open(knowledge_base, 'w') as knowledge_base_file:
            json.dump(knowledge, knowledge_base_file, indent=4)
        return jsonify({'message': 'Answer saved successfully!'}), 200
    except Exception as e:
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500
    
@app.route('/reset-kb', methods=['DELETE'])
def reset_kb():
    try:
        with open(knowledge_base, 'r') as knowledge_base_file:
            knowledge = json.load(knowledge_base_file)  
        knowledge["Score"] = 0
        knowledge["Facts"] = []
        with open(knowledge_base, 'w') as knowledge_base_file:
            json.dump(knowledge, knowledge_base_file, indent=4)
        return jsonify({"message": "Facts cleared successfully"}), 200
    except Exception as e:
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500
