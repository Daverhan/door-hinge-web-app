from flask import Blueprint, jsonify, request
from app.models.user import Listing, Address
from app.database import db

listing_bp = Blueprint('listing', __name__)


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
    listing_json = request.get_json()

    listing_fields = ['lister_id', 'name', 'desc',
                      'price', 'num_beds', 'num_baths', 'sqft']
    address_fields = ['house_num', 'street_name', 'city', 'state', 'zip_code']

    if not all(field in listing_json for field in listing_fields + address_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    listing_data = {field: listing_json[field] for field in listing_fields}
    address_data = {field: listing_json[field] for field in address_fields}

    try:
        listing = Listing(**listing_data)
        db.session.add(listing)

        db.session.flush()

        address = Address(**address_data, listing_id=listing.id)
        db.session.add(address)

        db.session.commit()

        return jsonify({"message": "Listing created successfully", **listing.to_dict()})
    except Exception as e:
        db.session.rollback()

        return jsonify({'error': str(e)}), 500


@listing_bp.route('<int:listing_id>', methods=['PUT'])
def update_listing(listing_id):
    listing_json = request.get_json()
    listing = Listing.query.get(listing_id)

    updatable_fields = ['lister_id', 'name', 'desc',
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
