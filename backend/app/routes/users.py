from flask import Blueprint, jsonify, request
from app.models.user import User
from app.database import db

user_bp = Blueprint('user', __name__)


@user_bp.route('', methods=['GET'])
def get_users():
    users = User.query.all()
    users_data = [user.to_dict() for user in users]
    return jsonify(users_data)


@user_bp.route('<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)

    if user:
        return jsonify(user.to_dict()), 200

    return jsonify({'error': 'User not found'}), 404


@user_bp.route('', methods=['POST'])
def create_user():
    user_json = request.get_json()

    if 'first_name' in user_json and 'last_name' in user_json:
        user = User(first_name=user_json['first_name'],
                    last_name=user_json['last_name'])
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created sucessfully', 'first_name': user.first_name, 'last_name': user.last_name}), 200

    return jsonify({'error': 'User must have a first name and last name'}), 400


@user_bp.route('<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user_json = request.get_json()

    if 'first_name' in user_json or 'last_name' in user_json:
        user = User.query.get(user_id)

        if user:
            if 'first_name' in user_json:
                user.first_name = user_json['first_name']
            if 'last_name' in user_json:
                user.last_name = user_json['last_name']

            db.session.commit()
            return jsonify({'message': 'User updated successfully', 'first_name': user.first_name, 'last_name': user.last_name}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify({'message': 'A first name and/or last name is required to update a user'}), 400


@user_bp.route('<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
