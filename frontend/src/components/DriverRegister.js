import React, { useState } from 'react';
// import { FaUserTie } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const DriverRegister = ({ isLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/register/driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsRegistrationSuccessful(true);
        setUsername('');
        setEmail('');
        setPassword('');
        navigate('/driver-login');
      } else {
        const { error } = data;
        setError(error);
        console.error('Registration failed:', error);
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-grow flex justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-indigo-900">Driver Registration</h2>
            {isRegistrationSuccessful && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                Registration successful!
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-900 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-800 transition-colors duration-300 w-full"
              >
                Register
              </button>
            </form>
            <p className="mt-4 text-gray-600">
              Already have an account?{' '}
              <Link to="/driver-login" className="text-indigo-900 font-bold">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DriverRegister;
