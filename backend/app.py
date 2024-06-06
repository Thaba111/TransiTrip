from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
# from models import  Driver, Passenger
from models import Bus
from models import db 
import base64
import requests
import re
from datetime import datetime
from requests.auth import HTTPBasicAuth

app = Flask(__name__)
my_endpoint = "https://9542-102-68-76-231.ngrok-free.app"
CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)
with app.app_context():
    db.create_all()


# Bus management routes
@app.route('/buses', methods=['POST'])
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
        plate_regex = r'^K[A-D][A-Z]{1} \d{3}[A-Z]$'
        if not re.match(plate_regex, data['number_plate']):
            return jsonify({'error': 'Invalid number_plate format'}), 400

        if not isinstance(data['no_of_seats'], int) or data['no_of_seats'] <= 0:
            return jsonify({'error': 'Invalid no_of_seats. It must be a positive integer'}), 400

        if not isinstance(data['cost_per_seat'], (int, float)) or data['cost_per_seat'] <= 0:
            return jsonify({'error': 'Invalid cost_per_seat. It must be a positive number'}), 400

        if not isinstance(data['route'], str) or not data['route'].strip():
            return jsonify({'error': 'Invalid route'}), 400

        if not isinstance(data['driver_id'], int) or data['driver_id'] <= 0:
            return jsonify({'error': 'Invalid driver_id. It must be a positive integer'}), 400

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


@app.route('/buses', methods=['GET'])
def get_buses():
    try:
        buses = Bus.query.all()
        return jsonify([bus.to_dict() for bus in buses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

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


@app.route('/pay', methods=['GET'])
def mpesa_express():
    phone_number = request.args.get('phone')
    amount = request.args.get('amount')

    try:
        access_token = get_mpesa_access_token(MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET)
    except Exception as e:
        return str(e), 500

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
        "AccountReference": "TransiTravels",
        "TransactionDesc": "Booking a Seat with TransiTravels"
    }

    response = requests.post(url, headers=headers, json=payload)
    return jsonify(response.json()), response.status_code


if __name__ == '__main__':
    app.run(debug=True, port=5000)
