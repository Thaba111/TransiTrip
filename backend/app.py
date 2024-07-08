from datetime import datetime
from flask import Flask, request, jsonify, Response, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from uuid import uuid4
from flask_session import Session
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User,Admin, Passenger, Driver, Bus, Booking
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt,unset_jwt_cookies
from dateutil import parser
import base64
import requests
import re
import logging  # Import the logging module

from requests.auth import HTTPBasicAuth


app = Flask(__name__)
bcrypt = Bcrypt(app)
my_endpoint = "https://9542-102-68-76-231.ngrok-free.app"
CORS(app)  # Allow all origins during development

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Configure Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)


Session(app)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to a random secret key
jwt = JWTManager(app)

db.init_app(app) 
migrate = Migrate(app, db)

# Create database tables within the application context
with app.app_context():
    db.create_all()


@app.route('/')
def index():
    return "Welcome to the Go-Bus API"


def token_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            # Handle the case where identity is a dictionary
            email = user_id.get('email')
            g.user = User.query.filter_by(email=email).first()
        else:
            g.user = User.query.get(user_id)
        if not g.user:
            return jsonify({'error': 'Invalid token'}), 401
        return func(*args, **kwargs)
    return wrapper

def role_required(role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            user = None
            if isinstance(identity, int):
                user = User.query.get(identity)
            elif isinstance(identity, dict):
                email = identity.get('email')
                user = User.query.filter_by(email=email).first()
            if not user or user.role != role:
                return jsonify({'error': 'Unauthorized'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

driver_required = role_required('driver')
passenger_required = role_required('passenger')
admin_required = role_required('admin')


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if the email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already exists.'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create a new user
    new_user = User(email=email, role='driver')
    db.session.add(new_user)
    db.session.flush()  # Flush to get the new user's ID

    # Create a new driver
    new_driver = Driver(
        username=username,
        password=hashed_password,
        user_id=new_user.id
    )
    db.session.add(new_driver)
    db.session.commit()

    return jsonify({'message': 'Registration successful!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find the user by email
    user = User.query.filter_by(email=email).first()

    if user:
        # Check if the user is a driver
        driver = user.driver
        if driver and check_password_hash(driver.password, password):
            access_token = create_access_token(identity=user.id, additional_claims={'role': user.role})
            return jsonify({'access_token': access_token})

        # Check if the user is a passenger
        passenger = user.passenger
        if passenger and check_password_hash(passenger.password, password):
            access_token = create_access_token(identity=user.id, additional_claims={'role': user.role})
            return jsonify({'access_token': access_token})
        
        admin = user.admin
        if admin and check_password_hash(admin.password, password):
            access_token = create_access_token(identity=user.id, additional_claims={'role': user.role})
            return jsonify({'access_token': access_token})

    # If the user is not found or the password is incorrect, return an error
    return jsonify({'error': 'Invalid email or password.'}), 401

# from flask import jsonify

@app.route('/user/<int:passenger_id>', methods=['GET'])
def get_user_by_passenger_id(passenger_id):
    try:
        passenger = Passenger.query.filter_by(id=passenger_id).first()
        if passenger:
            user = passenger.user  # Fetch associated user details
            if user:
                return jsonify({
                    'id': user.id,
                    'email': user.email,
                    'role': user.role
                }), 200
            else:
                return jsonify({'error': 'User details not found for passenger'}), 404
        else:
            return jsonify({'error': 'Passenger not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/user', methods=['GET'])
@token_required
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify({'id': user.id, 'email': user.email}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/user/<int:user_id>', methods=['GET'])
@token_required
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({'id': user.id, 'email': user.email}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/register/passenger', methods=['POST'])
def register_passenger():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if the email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already exists.'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create a new user
    new_user = User(email=email, role='passenger')
    db.session.add(new_user)
    db.session.flush()  # Flush to get the new user's ID

    # Create a new passenger
    new_passenger = Passenger(
        username=username,
        password=hashed_password,
        user_id=new_user.id
    )
    db.session.add(new_passenger)
    db.session.commit()

    return jsonify({'message': 'Registration successful!'}), 201

@app.route('/login/passenger', methods=['POST'])
def login_passenger():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find the user by email and ensure they are a passenger
    user = User.query.filter_by(email=email).first()
    if user and user.passenger:
        passenger = user.passenger
        if check_password_hash(passenger.password, password):
            access_token = create_access_token(identity=user.id, additional_claims={'role': user.role})
            return jsonify({'access_token': access_token})

    return jsonify({'error': 'Invalid email or password.'}), 401

# @app.route('/passenger/<int:passenger_id>', methods=['GET'])
# def get_passenger_details(passenger_id):
#     try:
#         user = User.query.get(passenger_id)

#         # Ensure the user has the correct role and access rights
#         if user and user.role == 'passenger':
#             passenger = Passenger.query.filter_by(user_id=passenger_id).first()
#             if passenger:
#                 return jsonify({
#                     'passenger_id': passenger.id,
#                     'username': passenger.username,
#                     'user_id': passenger.user_id,
#                     # Add other relevant details from Passenger model
#                 }), 200
#             else:
#                 return jsonify({'error': 'Passenger not found'}), 404
#         else:
#             return jsonify({'error': 'Unauthorized access'}), 401
#     except Exception as e:
#         app.logger.error(f"Error fetching passenger details: {str(e)}")
#         return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/passenger/<username>', methods=['GET'])
def get_passenger_by_username(username):
    try:
        passenger = Passenger.query.filter_by(username=username).first()
        if not passenger:
            return jsonify({'error': 'Passenger not found'}), 404
        return jsonify({'passenger_id': passenger.id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rename the function if necessary to ensure uniqueness
@app.route('/passenger-username/<username>', methods=['GET'])
def get_passenger_id_by_username(username):
    try:
        passenger = Passenger.query.filter_by(username=username).first()
        if not passenger:
            return jsonify({'error': 'Passenger not found'}), 404
        return jsonify({'passenger_id': passenger.id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/passenger/<int:passenger_id>/user-id', methods=['GET'])
@jwt_required()
def get_passenger_user_id(passenger_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if user and user.role == 'passenger' and current_user_id == passenger_id:
            passenger = Passenger.query.get(passenger_id)
            if not passenger:
                return jsonify({'error': 'Passenger not found'}), 404

            return jsonify({'user_id': passenger.user_id}), 200
        else:
            return jsonify({'error': 'Unauthorized access'}), 401
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500    
@app.route('/register/driver', methods=['POST'])
def register_driver():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Please provide username, email, and password.'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already exists.'}), 400

    hashed_password = generate_password_hash(password)

    try:
        new_user = User(email=email, role='driver')
        db.session.add(new_user)
        db.session.flush()

        new_driver = Driver(
            username=username,
            password=hashed_password,
            user_id=new_user.id
        )
        db.session.add(new_driver)
        db.session.commit()

        return jsonify({'message': 'Registration successful!'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to register user.', 'details': str(e)}), 500


@app.route('/login/driver', methods=['POST'])
def login_driver():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user:
        driver = user.driver
        if driver and check_password_hash(driver.password, password):
            access_token = create_access_token(identity=user.id, additional_claims={'role': user.role})
            return jsonify({'access_token': access_token})

    return jsonify({'error': 'Invalid email or password.'}), 401

    
@app.route('/register/admin', methods=['POST'])
def admin_register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if the email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already exists.'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create a new user
    new_user = User(email=email, role='admin')
    db.session.add(new_user)
    db.session.flush()  # Flush to get the new user's ID

    # Create a new admin
    new_admin = Admin(
        username=username,
        password=hashed_password,
        user_id=new_user.id
    )
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({'message': 'Admin registration successful!'}), 201
       
@app.route('/login/admin', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find the user by email and ensure they are an admin
    user = User.query.filter_by(email=email).first()
    if user and user.is_admin:
        if check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id, additional_claims={'role': user.role})
            return jsonify({'access_token': access_token})

    return jsonify({'error': 'Invalid email or password.'}), 401
        
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Logout route for revoking the current user's access token.
    """
    resp = jsonify({'message': 'Logout successful'})
    unset_jwt_cookies(resp)
    return resp, 200

# Bus management routes

@app.route('/buses', methods=['POST'])
# @token_required
def create_bus():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['company_name', 'number_plate', 'no_of_seats', 'cost_per_seat', 'route', 'driver_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate data types and constraints
        if not isinstance(data['company_name'], str) or not data['company_name'].strip():
            return jsonify({'error': 'Invalid company_name'}), 400

        if not isinstance(data['number_plate'], str) or not data['number_plate'].strip():
            return jsonify({'error': 'Invalid number_plate'}), 400
        
        # Validate number_plate format
        plate_regex = r'^K[A-D][A-Z] \d{3}[A-Z]$'

        if not re.match(plate_regex, data['number_plate']):
            return jsonify({'error': 'Invalid number_plate format'}), 400

        # if not isinstance(data['no_of_seats'], int) or data['no_of_seats'] <= 0:
        #     return jsonify({'error': 'Invalid no_of_seats. It must be a positive integer'}), 400

        # if not isinstance(data['cost_per_seat'], (int, float)) or data['cost_per_seat'] <= 0:
        #     return jsonify({'error': 'Invalid cost_per_seat. It must be a positive number'}), 400

        if not isinstance(data['route'], str) or not data['route'].strip():
            return jsonify({'error': 'Invalid route'}), 400

        # if not isinstance(data['driver_id'], int) or data['driver_id'] <= 0:
        #     return jsonify({'error': 'Invalid driver_id. It must be a positive integer'}), 400

        # Create the bus object
        bus = Bus(
            company_name=data['company_name'],
            number_plate=data['number_plate'],
            no_of_seats=data['no_of_seats'],
            cost_per_seat=data['cost_per_seat'],
            route=data['route'],
            driver_id=data['driver_id']
        )

        # Add to database
        db.session.add(bus)
        db.session.commit()
        return jsonify({'message': 'Bus created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# @app.route('/buses', methods=['GET'])
# # @token_required
# def get_buses():
#     try:
#         buses = Bus.query.all()
#         return jsonify([bus.to_dict() for bus in buses]), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    
@app.route('/buses', methods=['GET'])
def get_buses():
    buses = Bus.query.all()
    return jsonify([bus.to_dict() for bus in buses])

# @app.route('/buses/<int:bus_id>', methods=['GET'])
# # @token_required
# def get_bus_by_id(bus_id):
#     try:
#         bus = Bus.query.get(bus_id)
#         if not bus:
#             return jsonify({'error': 'Bus not found'}), 404

#         return jsonify(bus.to_dict()), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    
@app.route('/buses/<int:bus_id>', methods=['GET'])
def get_bus_by_id(bus_id):
    try:
        bus = Bus.query.get(bus_id)
        if bus:
            return jsonify({
                'id': bus.id,
                'company_name': bus.company_name,
                'number_plate': bus.number_plate,
                'no_of_seats': bus.no_of_seats,
                'cost_per_seat': bus.cost_per_seat,
                'route': bus.route,
                'driver_id': bus.driver_id
            }), 200
        else:
            return jsonify({'error': 'Bus not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/buses/schedule', methods=['POST'])
def schedule_bus():
    try:
        data = request.get_json()
        number_plate = data.get('number_plate')
        route = data.get('route')
        scheduled_time = data.get('scheduled_time')

        if not number_plate or not route or not scheduled_time:
            return jsonify({'error': 'Missing number_plate, route, or scheduled_time'}), 400

        # Parse scheduled_time to datetime object
        scheduled_time = datetime.strptime(scheduled_time, '%Y-%m-%d %H:%M:%S')

        # Query the database to find the bus by number_plate and route
        bus = Bus.query.filter_by(number_plate=number_plate, route=route).first()
        if not bus:
            return jsonify({'error': 'Bus not found'}), 404

        # Update the bus's departure_time attribute with scheduled time
        bus.departure_time = scheduled_time

        # Commit changes to the database
        db.session.commit()

        return jsonify({'message': 'Bus scheduled successfully'}), 200

    except ValueError:
        return jsonify({'error': 'Invalid scheduled_time format. It should be in YYYY-MM-DD HH:MM:SS format'}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@app.route('/buses/cost-per-seat', methods=['GET'])
def get_cost_per_seat():
    try:
        buses = Bus.query.all()
        cost_per_seat_info = []

        for bus in buses:
            # Validate cost_per_seat
            if isinstance(bus.cost_per_seat, (int, float)) and bus.cost_per_seat > 0:
                cost_per_seat_info.append({
                    "bus_id": bus.id,
                    "cost_per_seat": bus.cost_per_seat
                })
            else:
                app.logger.warning(f"Invalid cost_per_seat for bus ID {bus.id}: {bus.cost_per_seat}")

        return jsonify(cost_per_seat_info), 200

    except Exception as e:
        app.logger.error(f"Error fetching cost per seat: {e}")
        return jsonify({'error': str(e)}), 500    

@app.route('/buses/cost-per-seat/<int:bus_id>', methods=['GET'])
def get_cost_per_seat_by_id(bus_id):
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404

    return jsonify({'cost_per_seat': bus.cost_per_seat})

@app.route('/buses/scheduled', methods=['GET'])
def get_scheduled_buses():
    try:
    
        scheduled_buses = Bus.query.filter(Bus.departure_time.isnot(None)).all()
        serialized_buses = [bus.serialize() for bus in scheduled_buses]
        
        # Return the serialized buses as a JSON response
        return jsonify(serialized_buses), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

            
@app.route('/buses/add-price-per-seat/<int:bus_id>', methods=['POST'])
def add_price_per_seat(bus_id):
    try:
        data = request.get_json()
        price_per_seat = data.get('price_per_seat')

        if not price_per_seat:
            return jsonify({'error': 'Missing price_per_seat'}), 400

        bus = Bus.query.get(bus_id)
        if not bus:
            return jsonify({'error': 'Bus not found'}), 404
        
        bus.price_per_seat = price_per_seat

        db.session.commit()

        return jsonify({'message': 'Price per seat added successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/buses/<int:bus_id>', methods=['PUT'])
def update_bus(bus_id):
    try:
        data = request.json
        bus = Bus.query.get(bus_id)
        if not bus:
            return jsonify({'error': 'Bus not found'}), 404

        # Update the bus attributes
        if 'number_plate' in data:
            bus.number_plate = data['number_plate']
        if 'no_of_seats' in data:
            bus.no_of_seats = data['no_of_seats']
        if 'cost_per_seat' in data:
            bus.cost_per_seat = data['cost_per_seat']
        if 'route' in data:
            bus.route = data['route']
        if 'departure_time' in data:
            bus.departure_time = datetime.fromisoformat(data['departure_time'])  # Handle ISO format

        # Commit changes to the database
        db.session.commit()

        return jsonify({'message': 'Bus updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/buses/<int:id>', methods=['DELETE'])
def remove_bus(id):
    try:
        bus = Bus.query.get(id)
        if bus:
            Booking.query.filter_by(bus_id=bus.id).delete()
            db.session.delete(bus)
            db.session.commit()
            return jsonify({'message': 'Bus and related bookings removed successfully'}), 200
        else:
            return jsonify({'error': 'Bus not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# @app.route('/buses/available-seats/<int:bus_id>', methods=['GET'])
# def get_available_seats(bus_id):
#     try:
#         bus = Bus.query.filter_by(id=bus_id).first()
#         if not bus:
#             return jsonify({'error': 'Bus not found'}), 404

#         total_seats = bus.no_of_seats
#         # Replace this with your actual query to fetch booked seats
#         booked_seats = Booking.query.filter_by(bus_id=bus_id).count()
#         available_seats = total_seats - booked_seats

#         return jsonify({'available_seats': available_seats}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@app.route('/buses/<int:bus_id>/seats', methods=['GET'])
def get_available_seats(bus_id):
    bus = Bus.query.get_or_404(bus_id)
    booked_seats = [booking.seat_number for booking in bus.bookings]
    available_seats = [seat for seat in range(1, bus.no_of_seats + 1) if seat not in booked_seats]
    return jsonify({'available_seats': available_seats})


# Fetch booked seats for a specific bus
@app.route('/booked-seats/<bus_id>', methods=['GET'])
def get_booked_seats(bus_id):
    try:
        # Example query to fetch booked seats for the given bus ID
        booked_seats = Booking.query.filter_by(bus_id=bus_id).with_entities(Booking.seat_number).all()
        booked_seat_numbers = [seat.seat_number for seat in booked_seats]

        return jsonify({'bookedSeats': booked_seat_numbers}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500    
    
@app.route('/bus/<int:bus_id>/seats/<int:seat_number>', methods=['GET'])
def get_seat_details(bus_id, seat_number):
    try:
        bus = Bus.query.get(bus_id)
        if bus:
            # Assuming seat information is stored or can be retrieved from a related model or table
            seat_details = {
                'bus_id': bus.id,
                'seat_number': seat_number,
                'seat_type': 'Standard',  # Example: Replace with actual seat type
                'availability': 'Available'  # Example: Replace with actual availability status
            }
            return jsonify(seat_details), 200
        else:
            return jsonify({'error': 'Bus not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/buses/seats/<int:bus_id>', methods=['GET'])
def get_bus_seats(bus_id):
    try:
        bus = Bus.query.get(bus_id)
        if not bus:
            return jsonify({'error': 'Bus not found'}), 404

        booked_seats = [booking.seat_number for booking in Booking.query.filter_by(bus_id=bus_id).all()]
        available_seats = list(range(1, bus.no_of_seats + 1))
        
        return jsonify({'available_seats': available_seats, 'booked_seats': booked_seats})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Booking Routes
# API endpoint to handle booking creation
@app.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()

    seat_numbers = data.get('seat_numbers', [])

    try:
        for seat_number in seat_numbers:
            new_booking = Booking(
                username=data['username'],
                company_name=data['company_name'],
                number_plate=data['number_plate'],
                seat_number=seat_number,
                mpesa_code=data['mpesa_code'],
                bus_id=data['bus_id']
                # You might need to parse datetime if sending as a string from frontend
            )
            db.session.add(new_booking)

        db.session.commit()
        return jsonify({'message': 'Bookings created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create bookings: {str(e)}'}), 500
    finally:
        db.session.close()
# @app.route('/booked-seats/<int:bus_id>', methods=['GET'])
# def get_booked_seats(bus_id):
#     try:
#         bus = Bus.query.get(bus_id)
#         if not bus:
#             return jsonify({'error': 'Bus not found'}), 404
        
#         booked_seats = [booking.seat_number for booking in bus.bookings]
        
#         return jsonify({'booked_seats': booked_seats}), 200
    
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@app.route('/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    data = request.json

    booking.username = data['username']
    booking.company_name = data['company_name']
    booking.number_plate = data['number_plate']
    booking.seat_number = data['seat_number']
    booking.mpesa_code = data['mpesa_code']
    booking.bus_id = data['bus_id']

    db.session.commit()
    return jsonify({'message': 'Booking updated successfully'})

@app.route('/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    db.session.delete(booking)
    db.session.commit()
    return jsonify({'message': 'Booking deleted successfully'})

@app.route('/bookings', methods=['GET'])
def get_all_bookings():
    try:
        bookings = Booking.query.all()
        return jsonify([booking.to_dict() for booking in bookings])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# @app.route('/booked-seats/<int:bus_id>', methods=['GET'])
# def get_booked_seats(bus_id):
#     booked_seats = Booking.query.filter_by(bus_id=bus_id).with_entities(Booking.seat_number).all()
#     return jsonify({'booked_seats': [seat[0] for seat in booked_seats]})

@app.route('/book-seat', methods=['POST'])
def book_seat():
    data = request.json
    bus_id = data.get('bus_id')
    seat_number = data.get('seat_number')

    # Check if the seat is available
    bus = Bus.query.get_or_404(bus_id)
    if seat_number <= 0 or seat_number > bus.total_seats:
        abort(400, 'Invalid seat number')

    # Check if the seat is already booked
    existing_booking = Booking.query.filter_by(bus_id=bus_id, seat_number=seat_number).first()
    if existing_booking:
        abort(400, 'Seat already booked')

    new_booking = Booking(
        username=data['username'],
        company_name=data['company_name'],
        number_plate=data['number_plate'],
        seat_number=data['seat_number'],
        mpesa_code=data['mpesa_code'],
        bus_id=data['bus_id']
        # departure_time will default to current time
    )
    db.session.add(new_booking)
    db.session.commit()
    return jsonify({'message': 'Seat booked successfully'}), 201
@app.route('/buses/<int:bus_id>/book', methods=['POST'])
def book_seat_by_id(bus_id):
    data = request.json
    username = data.get('username')
    seat_number = data.get('seat_number')

    # Check if seat is available
    bus = Bus.query.get_or_404(bus_id)
    booked_seats = [booking.seat_number for booking in bus.bookings]
    if seat_number in booked_seats:
        return jsonify({'error': 'Seat already booked'}), 400

    # Create a new booking
    new_booking = Booking(
        username=username,
        company_name=bus.company_name,
        number_plate=bus.number_plate,
        seat_number=seat_number,
        bus_id=bus.id,
        mpesa_code=str(uuid4())  # Generate a unique M-Pesa code
    )
    db.session.add(new_booking)
    db.session.commit()

    return jsonify({'message': 'Seat booked successfully', 'booking_id': new_booking.id}), 201


@app.route('/bookings/<username>', methods=['GET'])
def get_user_bookings(username):
    user = User.query.filter_by(username=username).first_or_404()
    if user.role == 'passenger':
        passenger = Passenger.query.filter_by(user_id=user.id).first()
        bookings = Booking.query.filter_by(username=passenger.username).all()
        return jsonify([booking.to_dict() for booking in bookings])
    else:
        return jsonify({'error': 'User is not a passenger'}), 400


@app.route('/remaining-seats/<int:bus_id>', methods=['GET'])
def get_remaining_seats(bus_id):
    booked_seats = set(Booking.query.filter_by(bus_id=bus_id).with_entities(Booking.seat_number).all())
    total_seats = set(range(1, Bus.query.get_or_404(bus_id).total_seats + 1))
    remaining_seats = list(total_seats - booked_seats)
    return jsonify({'remaining_seats': remaining_seats})

@app.route('/booking-details/<int:booking_id>', methods=['GET'])
def get_booking_details(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    return jsonify({
        'id': booking.id,
        'username': booking.username,
        'company_name': booking.company_name,
        'number_plate': booking.number_plate,
        'seat_number': booking.seat_number,
        'departure_time': booking.departure_time.isoformat(),
        'mpesa_code': booking.mpesa_code,
        'bus_id': booking.bus_id
    })

# M-PESA API settings
MPESA_CONSUMER_KEY = 'Ofee1mD0EBOFJKOddRlbewvzrb0Z2LXa8fdRzpgVEMlkamud'
MPESA_CONSUMER_SECRET = 'z7KBKdETyVRO7tIXgdVfAn3pXWB2AAX2mWlgbPzVzCs4Q74WZEIZ7PSCv8qWOYXp'
MPESA_BUSINESS_SHORTCODE = '174379'
MPESA_PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
MPESA_CALLBACK_URL = 'https://mydomain.com/path'


def get_mpesa_access_token(consumer_key, consumer_secret):
    url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    response = requests.get(url, auth=HTTPBasicAuth(consumer_key, consumer_secret))
    if response.status_code == 200:
        return response.json().get('access_token')
    raise Exception(f"Failed to get access token: {response.status_code} - {response.text}")


def generate_timestamp():
    return datetime.now().strftime("%Y%m%d%H%M%S")


def generate_password(business_short_code, pass_key, timestamp):
    password = f"{business_short_code}{pass_key}{timestamp}"
    return base64.b64encode(password.encode()).decode()


@app.route('/pay', methods=['POST'])
def mpesa_express():
    data = request.json
    phone_number = data.get('phone')
    amount = data.get('amount')

    # Use logging to log your payment request details
    logging.info(f"Payment Request: Phone - {phone_number}, Amount - {amount}")

    try:
        access_token = get_mpesa_access_token(MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET)
    except Exception as e:
        logging.error(f"Error getting access token: {str(e)}")
        return jsonify({"error": str(e)}), 500

    timestamp = generate_timestamp()
    password = generate_password(MPESA_BUSINESS_SHORTCODE, MPESA_PASSKEY, timestamp)

    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    payload = {
        "BusinessShortCode": MPESA_BUSINESS_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": MPESA_BUSINESS_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": MPESA_CALLBACK_URL,
        "AccountReference": "My Safari App",
        "TransactionDesc": "Booking a Seat with TransiTravels"
    }

    response = requests.post(url, headers=headers, json=payload)
    logging.info(f"Payment Response: {response.json()}")
    return jsonify(response.json()), response.status_code

@app.route('/confirm-payment', methods=['POST'])
def confirm_payment():
    try:
        data = request.json
        mpesa_code = data.get('mpesaCode')
        amount = data.get('amount')

        if not (mpesa_code and amount):
            return jsonify({"error": "M-PESA confirmation code and amount are required."}), 400

        # Example validation - replace with your actual validation logic
        if mpesa_code == 'SFF3KGDXMT' and amount == 1000:  
            # Payment confirmed successfully
            return jsonify({"success": True}), 200
        else:
            # Invalid confirmation code or amount
            return jsonify({"error": "Invalid M-PESA confirmation code or amount."}), 400
    
    except Exception as e:
        app.logger.error(f"Error processing confirm-payment: {str(e)}")
        return jsonify({"error": "An error occurred while processing the request."}), 500

# if __name__ == '__main__':
#     logging.basicConfig(level=logging.INFO)  # Set logging level to INFO
#     app.run(debug=True, port=5000)

@app.route('/validate-mpesa-code', methods=['POST'])
def validate_mpesa_code():
    data = request.get_json()
    mpesa_code = data.get('mpesaCode')

    # Dummy validation logic
    if mpesa_code and len(mpesa_code) == 10:
        # Replace with actual validation logic if needed
        return jsonify({'valid': True})
    else:
        return jsonify({'valid': False}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
