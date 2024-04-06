from flask_socketio import emit
from ..extensions import socketio

@socketio.on('connect')
def handle_connect():
    print('A user connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('User disconnected')

@socketio.on('send_message')
def handle_send_message(data):
    print(f"{data['username']} says: {data['message']}")
    socketio.emit('receive_message', data)
