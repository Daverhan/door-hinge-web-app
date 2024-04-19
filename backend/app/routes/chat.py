from ..extensions import socketio
from ..models import User
from flask import session
from flask_socketio import SocketIO, emit, disconnect
from datetime import datetime

@socketio.on('connect')
def on_connect():
    username = session.get('username')

    if username:
        user = User.query.filter_by(username=username).first()
        if user and user.username in ['dsilva', 'aidanc']:
            session['user'] = user.username
            print(f"{user.username} connected.")
            emit('user connected', {'user': user.username}, broadcast=True)
        else:
            print("Connection attempt with invalid username.")
            emit('error', {'error': 'Invalid username'})
            disconnect()
    else:
        print("No username provided for connection.")
        emit('error', {'error': 'No username provided'})
        disconnect()

@socketio.on('send_message')
def handle_message(json):
    if 'user' not in session:
        emit('error', {'error': 'User not logged in'})
        return
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    message_info = {
        'user': session['user'],
        'data': json['data'],
        'timestamp': timestamp
    }
    print(f"{message_info['user']} sent message at {timestamp}: {message_info['data']}")
    emit('receive message', message_info, broadcast=True)
