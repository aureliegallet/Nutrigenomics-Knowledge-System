from flask import Flask, render_template

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