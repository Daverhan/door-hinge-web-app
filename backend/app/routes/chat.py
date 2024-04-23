from ..extensions import socketio, db
from ..models import User, Chat, Message
from flask import session
from flask_socketio import SocketIO, emit, join_room, leave_room, disconnect
from datetime import datetime

@socketio.on('connect')
def on_connect():
    username = session.get('username')
    if username:
        print(f"{username} connected.")
    else:
        emit('error', {'error': 'No username provided'}, room=request.sid)
        disconnect()

@socketio.on('join_room')
def on_join(data):
    room = data['room']
    session['current_room'] = room  # Store the current room in the session
    join_room(room)
    emit('user connected', {'user': session['username']}, room=room)

@socketio.on('leave_room')
def on_leave(data):
    room = data['room']
    leave_room(room)
    emit('user left', {'user': session['username']}, room=room)

@socketio.on('disconnect')
def on_disconnect():
    if 'current_room' in session:
        leave_room(session['current_room'])
        emit('user disconnected', {'user': session['username']}, room=session['current_room'])

@socketio.on('send_message')
def handle_message(json):
    room = json.get('chat_id')
    if 'username' not in session:
        emit('error', {'error': 'User not logged in'}, room=room)
        return

    user_username = session['username']
    user = User.query.filter_by(username=user_username).first()
    if not user:
        emit('error', {'error': 'Invalid user'}, room=room)
        return

    chat = Chat.query.get(room)
    if not chat:
        emit('error', {'error': 'Invalid chat ID'}, room=room)
        return

    new_message = Message(
        content=json['content'],
        timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        chat_id=room,
        sender_id=user.id,
        sender_name=user.username
    )

    db.session.add(new_message)
    db.session.commit()

    message_info = {
        'sender_name': user.username,
        'content': json['content'],
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    emit('receive message', message_info, room=room)
