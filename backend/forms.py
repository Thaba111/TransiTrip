# forms.py
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, IntegerField
from wtforms.validators import DataRequired, Email, Length, Regexp, ValidationError
from models import User, Driver, Passenger, Admin, Bus, Booking
from wtforms.fields import DateTimeField

def validate_email(form, field):
    if User.query.filter_by(email=field.data).first() or Admin.query.filter_by(email=field.data).first():
        raise ValidationError('Email already in use.')

def validate_username(form, field):
    if Driver.query.filter_by(username=field.data).first() or Passenger.query.filter_by(username=field.data).first():
        raise ValidationError('Username already in use.')

def validate_number_plate(form, field):
    pattern = r'^K[A-D]\s\d{3}[A-Z]$'
    if not Regexp(pattern).match(field.data):
        raise ValidationError('Invalid number plate format.')

class UserForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(), validate_email])
    role = StringField('Role', validators=[DataRequired()])

class DriverForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), validate_username])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6), Regexp(
        r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$',
        message="Password must contain at least one letter, one number, and one special character."
    )])
    user_id = IntegerField('User ID', validators=[DataRequired()])

class PassengerForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), validate_username])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6), Regexp(
        r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$',
        message="Password must contain at least one letter, one number, and one special character."
    )])
    user_id = IntegerField('User ID', validators=[DataRequired()])

class AdminForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), validate_username])
    email = StringField('Email', validators=[DataRequired(), Email(), validate_email])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6), Regexp(
        r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$',
        message="Password must contain at least one letter, one number, and one special character."
    )])


class BusForm(FlaskForm):
    company_name = StringField('Company Name', validators=[DataRequired()])
    driver_id = IntegerField('Driver ID', validators=[DataRequired()])
    number_plate = StringField('Number Plate', validators=[DataRequired(), validate_number_plate])
    no_of_seats = IntegerField('Number of Seats', validators=[DataRequired()])
    cost_per_seat = IntegerField('Cost per Seat', validators=[DataRequired()])
    route = StringField('Route', validators=[DataRequired()])
    departure_time = DateTimeField('Departure Time', format='%Y-%m-%dT%H:%M:%S', validators=[DataRequired()])
