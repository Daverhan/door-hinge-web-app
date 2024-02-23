from flask import Blueprint, jsonify, request
from app.models.user import User, Listing, Chat, Message, user_chat_association
from app.database import db

user_bp = Blueprint('user', __name__)


@user_bp.route('', methods=['GET'])
def get_listings():
    listings = Listing.query.all()
    listings_data = [listing.to_dict() for listing in listings]

    return jsonify(listings_data)


@user_bp.route('', methods=['GET'])
def get_users():
    users = User.query.all()
    users_data = [user.to_dict() for user in users]

    return jsonify(users_data)


@user_bp.route('<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict()), 200


@user_bp.route('', methods=['POST'])
def create_user():
    user_json = request.get_json()

    required_fields = ['first_name', 'last_name',
                       'email', 'username', 'password']

    if all(field in user_json for field in required_fields):
        user_data = {field: user_json[field] for field in required_fields}
        user = User(**user_data)

        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'User created sucessfully', **user.to_dict()}), 200

    return jsonify({'error': 'Missing required fields'}), 400


@user_bp.route('<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user_json = request.get_json()
    user = User.query.get(user_id)

    updatable_fields = ['first_name', 'last_name',
                        'email', 'username', 'password']

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not any(field in user_json for field in updatable_fields):
        return jsonify({'message': 'At least one updatable field must be provided'})

    for field in updatable_fields:
        if field in user_json:
            setattr(user, field, user_json[field])

    db.session.commit()

    return jsonify({'message': 'User updated successfully', **user.to_dict()}), 200


@user_bp.route('<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404


@user_bp.route('<int:user_id>/chats', methods=['GET'])
def get_user_chats(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify([chat.to_dict() for chat in user.chats])


@user_bp.route('<int:user_id>/chats/<int:chat_id>', methods=['GET'])
def get_a_user_chat(user_id, chat_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    association_exists = db.session.query(db.exists().where(
        (user_chat_association.c.user_id == user_id) &
        (user_chat_association.c.chat_id == chat_id)
    )).scalar()

    if not association_exists:
        return jsonify({'error': 'No such chat found for the user'}), 404

    user_chat = Chat.query.get(chat_id)

    if not user_chat:
        return jsonify({'error': 'Chat not found'})

    return jsonify(user_chat.to_dict())


@user_bp.route('<int:user_id>/chats', methods=['POST'])
def create_user_chat(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    chat = Chat()
    db.session.add(chat)
    db.session.commit()

    new_association = {'user_id': user_id, 'chat_id': chat.id}
    db.session.execute(user_chat_association.insert().values(new_association))
    db.session.commit()

    return jsonify({'message': 'Chat created successfully', 'chat_id': chat.id, 'user_id': user.id}), 201


@user_bp.route('<int:user_id>/chats/<int:chat_id>', methods=['DELETE'])
def delete_user_chat(user_id, chat_id):
    user = User.query.get(user_id)
    chat = Chat.query.get(chat_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not chat:
        return jsonify({'error': 'Chat not found'}), 404

    association_exists = db.session.query(db.exists().where(
        (user_chat_association.c.user_id == user_id) &
        (user_chat_association.c.chat_id == chat_id)
    )).scalar()

    if not association_exists:
        return jsonify({'error': 'No such chat found for the user'}), 404

    db.session.execute(user_chat_association.delete().where(
        (user_chat_association.c.user_id == user_id) &
        (user_chat_association.c.chat_id == chat_id)
    ))
    db.session.commit()

    return jsonify({'message': 'Chat successfully removed from the user'}), 200


@user_bp.route('<int:user_id>/chats/<int:chat_id>/messages', methods=['POST'])
def create_message(user_id, chat_id):
    message_json = request.get_json()

    user = User.query.get(user_id)
    chat = Chat.query.get(chat_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not chat:
        return jsonify({'error': 'Chat not found'}), 404

    association_exists = db.session.query(db.exists().where(
        (user_chat_association.c.user_id == user_id) &
        (user_chat_association.c.chat_id == chat_id)
    )).scalar()

    if not association_exists:
        return jsonify({'error': 'No such chat found for the user'}), 404

    if 'content' not in message_json or not (message_json['content']).strip():
        return jsonify({'error': 'Missing message content'})

    message = Message(
        content=message_json['content'], chat_id=chat_id, sender_id=user_id)

    db.session.add(message)
    db.session.commit()

    return jsonify({'message': 'Message successfully created', **message.to_dict()}), 201
