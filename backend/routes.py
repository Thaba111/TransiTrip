from flask import Blueprint, jsonify
from models import db, Bus
from flask_jwt_extended import jwt_required, get_jwt_identity
from middleware import role_required
from auth.auth import auth

# Define the main routes blueprint
routes = Blueprint('routes', __name__)

# Import the auth blueprint from the same module
from .auth import auth  # Assuming 'auth' is defined in auth.py within the same folder

@routes.route('/buses', methods=['GET'])
@jwt_required()
def get_buses():
    buses = Bus.query.all()
    return jsonify([bus.to_dict() for bus in buses]), 200

@routes.route('/book/<int:bus_id>', methods=['POST'])
@jwt_required()
@role_required('passenger')
def book_seat(bus_id):
    user = get_jwt_identity()
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({"msg": "Bus not found"}), 404

    # Add logic to book seats

    return jsonify({"msg": "Seats booked successfully"}), 200