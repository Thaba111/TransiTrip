import sys
import os

# Get the absolute path to the directory containing the `backend` module
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend'))

# Add the directory to the Python path
sys.path.append(backend_path)

# Now you should be able to import `create_app` from the `backend` module
from backend import create_app

# Create the Flask app using the `create_app` function
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
