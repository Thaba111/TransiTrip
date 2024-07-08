from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from sqlalchemy import MetaData
from sqlalchemy import DateTime
from datetime import datetime  
from datetime import datetime 

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False)

    driver = db.relationship('Driver', backref='user', uselist=False)
    passenger = db.relationship('Passenger', backref='user', uselist=False)
    # admin = db.relationship('Admin', backref='user', uselist=False)

    def __repr__(self):
        return f"<User id={self.id}, email={self.email}, role={self.role}>"

class Driver(db.Model):
    __tablename__ = 'drivers'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)

    def __repr__(self):
        return f"<Driver id={self.id}, username={self.username}>"


class Passenger(db.Model):
    __tablename__ = 'passengers'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)

    def __repr__(self):
        return f"<Passenger id={self.id}, username={self.username}>"

class Admin(db.Model):
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)

    def __repr__(self):
        return f"Admin id={self.id}, username={self.username}"


class Bus(db.Model):
    __tablename__ = 'buses'
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), unique=True, nullable=False)
    number_plate = db.Column(db.String(7), nullable=False, unique=True)
    no_of_seats = db.Column(db.Integer, nullable=False)
    cost_per_seat = db.Column(db.Integer, nullable=False)
    route = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(DateTime)
    driver = db.relationship('Driver', backref=db.backref('bus', uselist=False))

    def __repr__(self):
        return f"<Bus id={self.id}, company_name={self.company_name}, number_plate={self.number_plate}, driver_id={self.driver_id}, route={self.route}>"

    def to_dict(self):
        return {
            'id': self.id,
            'company_name': self.company_name,
            'driver_id': self.driver_id,
            'number_plate': self.number_plate,
            'no_of_seats': self.no_of_seats,
            'cost_per_seat': self.cost_per_seat,
            'route': self.route,
            'departure_time': self.departure_time.isoformat() if self.departure_time else None
        }

    def serialize(self):
        return {
            'id': self.id,
            'company_name': self.company_name,
            'driver_id': self.driver_id,
            'number_plate': self.number_plate,
            'no_of_seats': self.no_of_seats,
            'cost_per_seat': self.cost_per_seat,
            'route': self.route,
            'departure_time': self.departure_time.isoformat() if self.departure_time else None
        }
class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)  # Username of the passenger
    company_name = db.Column(db.String(255), nullable=False)  # Name of the bus company
    number_plate = db.Column(db.String(50), nullable=False)  # Bus number plate
    seat_number = db.Column(db.Integer, nullable=False)  # Seat number booked
    departure_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Departure time of the bus
    mpesa_code = db.Column(db.String(100), unique=True, nullable=False)  # Unique M-Pesa code for the transaction

    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=False)
    # Define relationship to Bus model (assuming you have a Bus model defined)
    bus = db.relationship('Bus', backref=db.backref('bookings', lazy=True))

    def __repr__(self):
        return f'<Booking {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'company_name': self.company_name,
            'number_plate': self.number_plate,
            'seat_number': self.seat_number,
            'departure_time': self.departure_time.isoformat(),
            'mpesa_code': self.mpesa_code,
            # 'bus_id': self.bus_id
        }

