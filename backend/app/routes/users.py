from flask import Blueprint, jsonify, request, session, make_response
from app.models.user import User, Listing, Chat, Message, user_chat_association, user_favorited_listing_association, user_passed_listing_association
from app.extensions import db, bcrypt
from app.rbac_utilities import create_mysql_user, safe_db_connection

user_bp = Blueprint('user', __name__)


@user_bp.route('profile', methods=['GET'])
def get_current_user():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        user = user_db_session.query(User).filter_by(id=user_id).first()

    return jsonify({'id': user.id, 'username': user.username, 'first_name': user.first_name, 'last_name': user.last_name})


'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''


@user_bp.route('', methods=['GET'])
def get_users():
    users = User.query.all()
    users_data = [user.to_dict() for user in users]

    return jsonify(users_data)


'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''


@user_bp.route('<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict()), 200


@user_bp.route('logout', methods=['POST'])
def logout_user():
    session.clear()
    response = make_response()
    response.delete_cookie('session')
    return response


@user_bp.route('login', methods=['POST'])
def login_user():
    user_credentials_json = request.get_json()

    if 'username' not in user_credentials_json or 'password' not in user_credentials_json:
        return jsonify({'error': 'Missing required fields'}), 400

    username = user_credentials_json.get('username')
    password = user_credentials_json.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    session['user_id'] = user.id
    session['username'] = user.username
    session['password'] = user.password

    return jsonify({'message': 'Successfully logged in', 'id': user.id, 'username': user.username}), 200


@user_bp.route('', methods=['POST'])
def register_user():
    user_json = request.get_json()

    required_fields = ['first_name', 'last_name',
                       'email', 'username', 'password']

    if all(field in user_json for field in required_fields):
        user_exists = User.query.filter_by(
            email=user_json['email']).first() is not None or User.query.filter_by(username=user_json['username']).first() is not None

        if user_exists:
            return jsonify({'error': 'A user already exists with the provided username or email'}), 409

        user_json['password'] = bcrypt.generate_password_hash(
            user_json['password'])

        user_data = {field: user_json[field] for field in required_fields}
        user = User(**user_data)

        create_mysql_user(
            user_json['username'], user_json['password'].decode('utf-8'), 'user')

        db.session.add(user)
        db.session.commit()

        session['user_id'] = user.id
        session['username'] = user.username
        session['password'] = user.password

        return jsonify({'message': 'User created successfully', **user.to_dict()}), 200

    return jsonify({'error': 'Missing required fields'}), 400


'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''


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


'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''


@user_bp.route('<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404


'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''


@user_bp.route('<int:user_id>/chats', methods=['GET'])
def get_user_chats(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify([chat.to_dict() for chat in user.chats])


'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''


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


'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''


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


'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''


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


'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''


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


@user_bp.route('favorite-listings', methods=['POST'])
def favorite_a_listing_for_user():
    user_id = session.get('user_id')

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        user = user_db_session.query(User).get(user_id)

        listing_id_json = request.get_json()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if 'listing_id' not in listing_id_json:
            return jsonify({'error': 'Missing listing id'}), 404

        listing_id = listing_id_json['listing_id']

        listing = user_db_session.query(Listing).get(listing_id)

        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        new_association = {'user_id': user_id, 'listing_id': listing_id}
        user_db_session.execute(
            user_favorited_listing_association.insert().values(new_association))

        user_db_session.commit()

    return jsonify({'message': 'Listing successfully favorited for the user'}), 201

@user_bp.route('favorite-listings', methods=['GET'])
def get_favorite_a_listing_for_user():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    favorite_listings = (Listing.query.join(user_favorited_listing_association).filter(user_favorited_listing_association.c.user_id==user_id).all())

    favorites_data = []
    for listing in favorite_listings:
        favorites_data.append(listing.to_dict())
        
    return jsonify(favorites_data), 200

'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''


@user_bp.route('<int:user_id>/favorite-listings/<int:listing_id>', methods=['DELETE'])
def unfavorite_a_listing_from_user(user_id, listing_id):
    user = User.query.get(user_id)
    listing = Listing.query.get(listing_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    association_exists = db.session.query(db.exists().where(
        (user_favorited_listing_association.c.user_id == user_id) &
        (user_favorited_listing_association.c.listing_id == listing_id)
    )).scalar()

    if not association_exists:
        return jsonify({'error': 'Cannot unfavorite the specified listing from the user as it was not favorited'}), 404

    db.session.execute(user_favorited_listing_association.delete().where(
        (user_favorited_listing_association.c.user_id == user_id) &
        (user_favorited_listing_association.c.listing_id == listing_id)
    ))
    db.session.commit()

    return jsonify({'message': 'Listing successfully unfavorited from the user'}), 200


@user_bp.route('passed-listings', methods=['POST'])
def pass_a_listing_for_user():
    user_id = session.get('user_id')

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        user = user_db_session.query(User).get(user_id)

        listing_id_json = request.get_json()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if 'listing_id' not in listing_id_json:
            return jsonify({'error': 'Missing listing id'}), 404

        listing_id = listing_id_json['listing_id']

        listing = user_db_session.query(Listing).get(listing_id)

        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        new_association = {'user_id': user_id, 'listing_id': listing_id}
        user_db_session.execute(
            user_passed_listing_association.insert().values(new_association))

        user_db_session.commit()

    return jsonify({'message': 'Listing successfully passed for the user'}), 201