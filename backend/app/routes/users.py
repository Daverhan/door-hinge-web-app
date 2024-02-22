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
