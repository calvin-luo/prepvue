from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    """Main application page with webcam and question interface."""
    return render_template('index.html')

@app.route('/question', methods=['GET'])
def get_question():
    """Placeholder for question endpoint - to be implemented in Week 2"""
    # This will return a question object including answer key
    return {"status": "not implemented yet"}, 501

@app.route('/submit', methods=['POST'])
def submit_answer():
    """Placeholder for submit endpoint - to be implemented in Week 3"""
    # This will handle decision logic for follow-ups or revealing answers
    return {"status": "not implemented yet"}, 501

@app.route('/followup', methods=['POST'])
def get_followup():
    """Placeholder for followup endpoint - to be implemented in Week 3"""
    # This will call Ollama and return a follow-up question
    return {"status": "not implemented yet"}, 501

if __name__ == '__main__':
    app.run(debug=True)