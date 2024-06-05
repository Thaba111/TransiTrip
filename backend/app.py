from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import base64
import requests
from datetime import datetime
from requests.auth import HTTPBasicAuth

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import models
from models import User, Driver, Passenger, Admin, Bus, Booking

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
