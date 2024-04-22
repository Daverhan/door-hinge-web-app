from ..extensions import socketio, db
from ..models import User, Chat, Message
from flask import session
from flask_socketio import SocketIO, emit, disconnect
from datetime import datetime

@socketio.on('connect')
def on_connect():
    username = session.get('username')

    if username:
        user = User.query.filter_by(username=username).first()
        if user:
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
    user_username = session['user']
    user = User.query.filter_by(username=user_username).first()

    if not user:
        emit('error', {'error': 'Invalid user'})
        return

    chat_id = json.get('chat_id')
    if chat_id is None:
        emit('error', {'error': 'chat_id is missing'})
        print("no chat_id")
        return
    chat = Chat.query.get(chat_id)

    if not chat:
        emit('error', {'error': 'Invalid chat ID'})
        return

    new_message = Message(
        content=json['content'],
        timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        chat_id=chat.id,
        sender_id=user.id,
        sender_name=user.username
    )

    db.session.add(new_message)
    db.session.commit()

    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    message_info = {
        'sender_name': session['user'],
        'content': json['content'],
        'timestamp': timestamp
    }
    print(f"{message_info['sender_name']} sent message at {timestamp}: {message_info['content']}")
    emit('receive message', message_info, broadcast=True)
