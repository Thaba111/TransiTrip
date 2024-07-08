import os
from faker import Faker
from flask import Flask
from models import db, User, Driver, Passenger, Admin, Bus, Booking
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # Adjust the database URI as needed
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

fake = Faker()

kenyan_cities = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Nyeri",
    "Malindi", "Machakos", "Naivasha", "Kitale", "Garissa", "Kakamega",
    "Nanyuki", "Meru", "Kericho", "Embu", "Isiolo", "Lamu", "Kilifi"
]

def generate_unique_route():
    city1, city2 = fake.random_elements(elements=kenyan_cities, length=2, unique=True)
    return f"{city1}-{city2}"

def seed_data():
    with app.app_context():
        # Drop all tables
        db.drop_all()

        # Create all tables
        db.create_all()

        # Create Users
        users = []
        for _ in range(10):
            user = User(
                email=fake.email(),
                role=fake.random_element(elements=("driver", "passenger", "admin"))
            )
            users.append(user)
            db.session.add(user)
        db.session.commit()

        # Create Drivers
        drivers = []
        for user in users:
            if user.role == "driver":
                driver = Driver(
                    username=fake.user_name(),
                    password=fake.password(),
                    user_id=user.id
                )
                drivers.append(driver)
                db.session.add(driver)
        db.session.commit()

        # Create Passengers
        passengers = []
        for user in users:
            if user.role == "passenger":
                passenger = Passenger(
                    username=fake.user_name(),
                    password=fake.password(),
                    user_id=user.id
                )
                passengers.append(passenger)
                db.session.add(passenger)
        db.session.commit()

        # Create Admins
        for user in users:
            if user.role == "admin":
                admin = Admin(
                    username=fake.user_name(),
                    email=user.email,
                    password=fake.password()
                )
                db.session.add(admin)
        db.session.commit()

        # Create Buses
        buses = []
        for driver in drivers:
            bus = Bus(
                company_name=fake.company(),
                driver_id=driver.id,
                number_plate=fake.license_plate(),
                no_of_seats=fake.random_int(min=20, max=50),
                cost_per_seat=fake.random_int(min=100, max=500),
                route=generate_unique_route(),
                departure_time=fake.date_time_this_month()
            )
            buses.append(bus)
            db.session.add(bus)
        db.session.commit()

        # Create Bookings
        for passenger in passengers:
            for _ in range(fake.random_int(min=1, max=5)):
                bus = fake.random_element(elements=buses)
                seat_number = fake.random_int(min=1, max=bus.no_of_seats)
                booking = Booking(
                    username=passenger.username,
                    number_plate=bus.number_plate,
                    seat_number=seat_number,
                    booking_time=datetime.utcnow()
                )
                db.session.add(booking)
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
