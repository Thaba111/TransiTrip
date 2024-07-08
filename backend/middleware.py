from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from flask import jsonify

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = get_jwt_identity()
            if user['role'] != role:
                return jsonify({"msg": "Permission denied"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
