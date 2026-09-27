from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_connection, init_db

app = Flask(__name__)
CORS(app)  # allows the frontend (different origin) to call this API

init_db()  # make sure the table exists when the app starts


@app.route("/tasks", methods=["GET"])
def get_tasks():
    conn = get_connection()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    return jsonify([dict(task) for task in tasks])


@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    text = data.get("text")

    conn = get_connection()
    conn.execute("INSERT INTO tasks (text, completed) VALUES (?, 0)", (text,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task added"}), 201


@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()
    completed = data.get("completed")

    conn = get_connection()
    conn.execute("UPDATE tasks SET completed = ? WHERE id = ?", (completed, task_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task updated"})


@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    conn = get_connection()
    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task deleted"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)