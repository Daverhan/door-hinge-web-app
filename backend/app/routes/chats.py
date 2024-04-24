from app.extensions import socketio
from app.models.user import User, Chat, Message
from flask import session
from flask_socketio import emit, join_room, leave_room, disconnect
from datetime import datetime
from app.rbac_utilities import safe_db_connection, is_user_authorized


@socketio.on('connect')
def on_connect():
    if not session.get('username'):
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
        emit('user disconnected', {
             'user': session['username']}, room=session['current_room'])


@socketio.on('send_message')
def handle_message(json):
    authorization = is_user_authorized('user')
    if isinstance(authorization, tuple):
        return authorization

    room = json.get('chat_id')

    user_username = session['username']

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        user = user_db_session.query(User).filter_by(
            username=user_username).first()

        chat = user_db_session.query(Chat).get(room)

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

        user_db_session.add(new_message)
        user_db_session.commit()

        message_info = {
            'sender_name': user.username,
            'content': json['content'],
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        emit('receive message', message_info, room=room)
