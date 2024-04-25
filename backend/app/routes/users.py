from app.rbac_utilities import create_mysql_user, safe_db_connection, is_user_authorized, is_user_authenticated, update_mysql_user
from app.extensions import db, bcrypt
from flask import Blueprint, jsonify, request, session, make_response
from app.models.user import (User, Listing, Chat, Message, user_chat_association,
                             user_favorited_listing_association, user_passed_listing_association,
                             MAX_FIRST_NAME_LENGTH, MAX_LAST_NAME_LENGTH, MAX_PASSWORD_LENGTH, MAX_EMAIL_LENGTH,
                             MAX_USERNAME_LENGTH)

user_bp = Blueprint('user', __name__)


@user_bp.route('check-auth')
def check_user_auth():
    authentication = is_user_authenticated()
    if isinstance(authentication, tuple):
        return authentication

    return jsonify({'message:': 'Authenticated'})


@user_bp.route('moderator', methods=['GET'])
def load_moderator_page():
    authorization = is_user_authorized('moderator')
    if isinstance(authorization, tuple):
        return authorization

    return jsonify({'message': 'Authorized'})


@user_bp.route('profile', methods=['GET'])
def get_current_user():
    authorization = is_user_authorized('user')
    if isinstance(authorization, tuple):
        return authorization

    user_id = session.get('user_id')

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        user = user_db_session.query(User).filter_by(id=user_id).first()

    return jsonify({'id': user.id, 'username': user.username, 'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email})


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


@user_bp.route('<int:user_id>', methods=['GET'])
def get_user(user_id):
    authorization = is_user_authorized('user')
    if isinstance(authorization, tuple):
        return authorization

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        user = user_db_session.query(User).get(user_id)

        return jsonify({"first_name": user.first_name, "last_name": user.last_name}), 200


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

    return jsonify({'message': 'Successfully logged in'}), 200


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

        if (len(user_json['first_name']) > MAX_FIRST_NAME_LENGTH or len(user_json['last_name']) >
                MAX_LAST_NAME_LENGTH or len(user_json['email']) > MAX_EMAIL_LENGTH or len(user_json['username']) >
                MAX_USERNAME_LENGTH or len(user_json['password']) > MAX_PASSWORD_LENGTH):
            return jsonify({'error': 'One or more input fields are over the maximum character limit', 'code': 'MAX_INPUT_LIMIT'}), 400

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

        return jsonify({'message': 'User created successfully'}), 200

    return jsonify({'error': 'Missing required fields'}), 400

'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''

@user_bp.route('/editprofile', methods=['PUT'])
def update_user():
    user_json = request.get_json()

    # Define required fields for the update
    required_fields = ['first_name', 'last_name', 'username', 'email']
    if not all(field in user_json for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if the update is attempting to use a username that already exists
    current_user_id = session.get('user_id')  # Get current user ID from session
    if User.query.filter(User.username == user_json['username'], User.id != current_user_id).first():
        return jsonify({'error': 'A user already exists with the provided username'}), 409

    # Validate length of each field
    if (len(user_json['first_name']) > MAX_FIRST_NAME_LENGTH or
        len(user_json['last_name']) > MAX_LAST_NAME_LENGTH or
        len(user_json['username']) > MAX_USERNAME_LENGTH):
        return jsonify({'error': 'One or more input fields are over the maximum character limit', 'code': 'MAX_INPUT_LIMIT'}), 400

    # Update user data
    user = User.query.filter_by(id=current_user_id).first()
    if user:
        if len(user_json['first_name']) != 0:
            user.first_name = user_json['first_name']
        if len(user_json['last_name']) != 0:
            user.last_name = user_json['last_name']
        if len(user_json['username']) != 0:
            user.username = user_json['username']
            update_mysql_user(user.username)
        if len(user_json['email']) != 0:
            user.email = user_json['email']

        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''

@user_bp.route('/resetpassword', methods=['PUT'])
def reset_password():
    user_json = request.get_json()

    user_id = session.get('user_id')

    # Check if 'password' is provided
    if 'password' not in user_json or not user_json['password']:
        return jsonify({'error': 'Password field is required'}), 400

    # Validate password length
    if len(user_json['password']) > MAX_PASSWORD_LENGTH:
        return jsonify({'error': 'Password exceeds maximum length allowed', 'code': 'MAX_INPUT_LIMIT'}), 400

    # Fetch the current user based on session ID
    current_user_id = session.get('user_id')  # Assumes user is logged in and their ID is in session
    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        user = user_db_session.query(User).filter_by(id=current_user_id).first()

        if user:
            # Encrypt the new password and update the user record
            print(user_json['password'])
            user_json['password'] = bcrypt.generate_password_hash(
                user_json['password'])        

            user.password = user_json['password']
            user_db_session.commit()

            user = user_db_session.query(User).filter_by(id=user_id).first()

            update_mysql_user(user.username, user.password)
        
            return jsonify({'message': 'Password reset successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404

'''
IMPORTANT:
THIS HEADER DENOTES THAT THE FOLLOWING API ROUTE MEETS ONE OF THE FOLLOWING CRITERIA:
- API ROUTE IS NEVER USED IN THE CLIENT-SIDE APPLICATION
- API ROUTE NEEDS RBAC IMPLEMENTED IN IT IF NECESSARY (A USER DB CONNECTION PERFORMING ACTIONS ON THEIR BEHALF, NOT THE ADMIN DB CONNECTION)
'''

@user_bp.route('delete', methods=['DELETE'])
def delete_user():
    # Retrieve user_id from session or from a request parameter
    user_id = session.get('user_id') or request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'No user ID provided'}), 400

    # Retrieve the user from the database using the user_id
    user = User.query.get(user_id)

    # Check if the user exists
    if user:
        db.session.delete(user)
        db.session.commit()
        session.pop('user_id', None)  # Remove user_id from session after deletion
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
    authorization = is_user_authorized('user')
    if isinstance(authorization, tuple):
        return authorization

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        message_json = request.get_json()

        user = user_db_session.query(User).get(user_id)
        chat = user_db_session.query(Chat).get(chat_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404
        if not chat:
            return jsonify({'error': 'Chat not found'}), 404

        association_exists = user_db_session.query(db.exists().where(
            (user_chat_association.c.user_id == user_id) &
            (user_chat_association.c.chat_id == chat_id)
        )).scalar()
        if not association_exists:
            return jsonify({'error': 'No such chat found for the user'}), 404

        if 'content' not in message_json or not message_json['content'].strip():
            return jsonify({'error': 'Missing message content'})

        message = Message(
            content=message_json['content'], chat_id=chat_id, sender_id=user_id)
        user_db_session.add(message)
        user_db_session.commit()

        return jsonify({'message': 'Message successfully created', **message.to_dict()}), 201


@user_bp.route('favorite-listings', methods=['POST'])
def favorite_a_listing_for_user():
    authorization = is_user_authorized('user')
    if isinstance(authorization, tuple):
        return authorization

    user_id = session.get('user_id')

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        user = user_db_session.query(User).get(user_id)
        listing_id_json = request.get_json()

        if 'listing_id' not in listing_id_json:
            return jsonify({'error': 'Missing listing id'}), 404

        listing_id = listing_id_json['listing_id']

        listing = user_db_session.query(Listing).get(listing_id)

        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        chat = user_db_session.query(Chat).filter_by(
            user_send=user.username, user_receive=listing.user.username).first()

        if not chat:
            chat = Chat(user_send=user.username,
                        user_receive=listing.user.username)
            user_db_session.add(chat)
            user_db_session.commit()

            # Create associations for both users
            new_association = {'user_id': user_id, 'chat_id': chat.id}
            user_db_session.execute(
                user_chat_association.insert().values(new_association))

            new_association = {'user_id': listing.user_id, 'chat_id': chat.id}
            user_db_session.execute(
                user_chat_association.insert().values(new_association))

            user_db_session.commit()

        new_association = {'user_id': user_id, 'listing_id': listing_id}
        user_db_session.execute(
            user_favorited_listing_association.insert().values(new_association))

        user_db_session.commit()

    return jsonify({'message': 'Listing successfully favorited for the user'}), 201


@user_bp.route('favorite-listings', methods=['GET'])
def get_favorite_a_listing_for_user():
    authorization = is_user_authorized('user')
    if isinstance(authorization, tuple):
        return authorization

    user_id = session.get('user_id')

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        favorite_listings = (user_db_session.query(Listing).join(user_favorited_listing_association).filter(
            user_favorited_listing_association.c.user_id == user_id).all())

        favorites_data = [listing.to_dict() for listing in favorite_listings]

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
    authorization = is_user_authorized('user')
    if isinstance(authorization, tuple):
        return authorization

    user_id = session.get('user_id')

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        listing_id_json = request.get_json()

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


@user_bp.route('/favorited_chats', methods=['GET'])
def get_chats():
    authorization = is_user_authorized('user')
    if isinstance(authorization, tuple):
        return authorization

    user_id = session['user_id']

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        user = user_db_session.query(User).get(user_id)

        favorited_listings = user.favorited_listings
        owned_listings = user.listings

        chats_data = []
        visited_chats = set()

        process_listings(favorited_listings, user, chats_data, visited_chats)
        process_listings(owned_listings, user, chats_data, visited_chats)

    return jsonify(chats_data)


@user_bp.route('/messages/<int:chat_id>')
def get_messages(chat_id):
    authorization = is_user_authorized('user')
    if isinstance(authorization, tuple):
        return authorization

    with safe_db_connection(session.get('username'), session.get('password')) as user_db_session:
        messages = user_db_session.query(Message).filter_by(
            chat_id=chat_id).order_by(Message.timestamp.asc()).all()
    return jsonify([message.to_dict() for message in messages])


def process_listings(listings, user, chats_data, visited_chats):
    for listing in listings:
        relevant_users = set()

        # Adds the owner of the listing if the user is a favorite
        if user in listing.favorited_by_users:
            relevant_users.add(listing.user.username)

        # Adds users who favorited the user's listing
        for other_user in listing.favorited_by_users:
            if other_user.username != user.username:
                relevant_users.add(other_user.username)

        for other_username in relevant_users:
            chats = Chat.query.filter(
                ((Chat.user_send == user.username) & (Chat.user_receive == other_username)) |
                ((Chat.user_receive == user.username)
                 & (Chat.user_send == other_username))
            ).all()
            for chat in chats:
                chat_key = tuple(sorted((user.username, other_username)))
                if chat_key not in visited_chats:
                    visited_chats.add(chat_key)
                    chats_data.append({
                        'chat_id': chat.id,
                        'other_user': other_username,
                        'listing_id': listing.id,
                        'listing_name': listing.name
                    })
