import uuid
from datetime import datetime
from flask import Blueprint, jsonify, request, session, current_app
from app.models.user import Listing, Address, User, Image
from app.extensions import db
import random
import os
import uuid

listing_bp = Blueprint('listing', __name__)


def generate_unique_filename(original_filename):
    ext = os.path.splitext(original_filename)[1]
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_uuid = uuid.uuid4().hex
    new_filename = f"{timestamp}_{random_uuid}{ext}"

    return new_filename


@listing_bp.route('next-listing', methods=['GET'])
def get_next_listing():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'No user attached to the request'}), 400

    user = User.query.get(user_id)

    if not user:
        return jsonify({'error', 'User not found'}), 404

    favorited_listings_ids = [
        listing.id for listing in user.favorited_listings]

    listings = Listing.query.filter(
        Listing.user_id != user_id, Listing.id.notin_(favorited_listings_ids)).all()

    if not listings:
        return jsonify({'error': 'No available listings to show'}), 400

    listings_data = [listing.to_dict() for listing in listings]

    random_listing = listings_data[random.randint(0, len(listings_data) - 1)]

    return jsonify(random_listing)


@listing_bp.route('', methods=['GET'])
def get_listings():
    listings = Listing.query.all()
    listings_data = [listing.to_dict() for listing in listings]

    return jsonify(listings_data)


@listing_bp.route('<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    listing = Listing.query.get(listing_id)

    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    return jsonify(listing.to_dict())


@listing_bp.route('', methods=['POST'])
def create_listing():
    upload_folder = current_app.config['UPLOAD_FOLDER']

    listing_str_fields = ['name', 'desc',]
    listing_num_fields = ['price', 'num_beds', 'num_baths', 'sqft']
    listing_fields = listing_str_fields + listing_num_fields

    address_str_fields = ['street_name', 'city', 'state']
    address_num_fields = ['house_num', 'zip_code']
    address_fields = address_str_fields + address_num_fields

    user_id = session.get('user_id')

    if not all(request.form.get(field) for field in listing_fields + address_fields) and not user_id:
        return jsonify({'error': 'Missing required fields'}), 400

    images = request.files.getlist('images')

    listing_str_data = {field: request.form.get(field)
                        for field in listing_str_fields}
    address_str_data = {field: request.form.get(field)
                        for field in address_str_fields}

    try:
        listing_num_data = {field: int(
            request.form.get(field)) for field in listing_num_fields}
        address_num_data = {field: int(
            request.form.get(field)) for field in address_num_fields}
    except ValueError:
        return jsonify({'error': 'One or more fields expected an integer'}), 400

    listing_data = {**listing_str_data, **listing_num_data}
    address_data = {**address_str_data, **address_num_data}

    try:
        listing = Listing(**listing_data, user_id=user_id)
        db.session.add(listing)

        db.session.flush()

        address = Address(**address_data, listing_id=listing.id)
        db.session.add(address)

        for image_file in images:
            if image_file:
                filename = generate_unique_filename(image_file.filename)
                file_path_os = os.path.join(upload_folder, filename)
                file_path_table = "images/" + filename
                image = Image(listing_id=listing.id,
                              name=filename, path=file_path_table)
                db.session.add(image)
                image_file.save(file_path_os)

        db.session.commit()

        return jsonify({"message": "Listing created successfully", **listing.to_dict()})
    except Exception as e:
        db.session.rollback()

        return jsonify({'error': str(e)}), 500


@listing_bp.route('<int:listing_id>', methods=['PUT'])
def update_listing(listing_id):
    listing_json = request.get_json()
    listing = Listing.query.get(listing_id)

    updatable_fields = ['user_id', 'name', 'desc',
                        'price', 'num_beds', 'num_baths', 'sqft']

    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    if not any(field in listing_json for field in updatable_fields):
        return jsonify({'message': 'At least one updatable field must be provided'})

    for field in updatable_fields:
        if field in listing_json:
            setattr(listing, field, listing_json[field])

    db.session.commit()

    return jsonify({'message': 'Listing updated successfully', **listing.to_dict()}), 200


@listing_bp.route('<int:listing_id>', methods=['DELETE'])
def delete_listing(listing_id):
    listing = Listing.query.get(listing_id)

    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    db.session.delete(listing)
    db.session.commit()

    return jsonify({'message': 'Listing deleted successfully'}), 200
