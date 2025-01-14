from flask import Flask, render_template, request, jsonify
import json

knowledge_base = '../Flask/static/json/kb.json'

app = Flask(__name__)

@app.route("/")
def show_home():
    return render_template('home.html')

@app.route("/system")
def show_system():
    reset_kb() # So that the kb score and saved information resets when the quiz gets automatically restarted upon page reload or navigation to another page
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
        with open(knowledge_base, 'r') as knowledge_base_file: # Get knowledge base
            knowledge = json.load(knowledge_base_file)
        score = knowledge["Score"]
        information = knowledge["Saved_Information"]
        suggestions = []

        for info in information:
            if info in knowledge["Suggestions"]:
                suggestions.append(knowledge["Suggestions"][info])

        return jsonify({"Score": score, "Suggestions": suggestions}), 200 # Send score and suggestion back
    except Exception as e:
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

@app.route('/update-kb', methods=['POST'])
def save_data():
    try:
        answer = request.get_json()
        with open(knowledge_base, 'r') as knowledge_base_file: # Get knowledge base
            knowledge = json.load(knowledge_base_file)

        # Update score
        question = knowledge["Knowledge_Base"].get(answer["questionKey"])
        if "points" in question:
            knowledge["Score"] = knowledge["Score"] + question["points"].get(answer["option"])

        # Update saved information
        if "to_save" in question and question["to_save"].get(answer["option"]) != None:
            information = question["to_save"].get(answer["option"])
            if isinstance(information, str):
                if information not in knowledge["Saved_Information"]: # No duplicates
                    knowledge["Saved_Information"].append(information)
            elif isinstance(information, list): # For the case where we have to add no meat, no fish and no dairy at the same time
                if information not in knowledge["Saved_Information"]: # No duplicates
                    knowledge["Saved_Information"].extend(information)

        # Check for interaction rules
        for rule in knowledge["Interaction_Rules"]:
            if all(condition in knowledge["Saved_Information"] for condition in rule["conditions"]):
                knowledge["Score"] = knowledge["Score"] + rule["points"]
                for condition in rule["conditions"]:
                    knowledge["Saved_Information"].remove(condition)

        # Write to file
        with open(knowledge_base, 'w') as knowledge_base_file:
            json.dump(knowledge, knowledge_base_file, indent=4)
        return jsonify({'message': 'Answer saved successfully!'}), 200
    except Exception as e:
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500
    
@app.route('/reset-kb', methods=['DELETE'])
def reset_kb():
    try:
        with open(knowledge_base, 'r') as knowledge_base_file: # Get knowledge base
            knowledge = json.load(knowledge_base_file)  
        knowledge["Score"] = 0
        knowledge["Saved_Information"] = []
        with open(knowledge_base, 'w') as knowledge_base_file: # Write back to knowledge base
            json.dump(knowledge, knowledge_base_file, indent=4)
        return jsonify({"message": "Facts cleared successfully"}), 200
    except Exception as e:
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500
