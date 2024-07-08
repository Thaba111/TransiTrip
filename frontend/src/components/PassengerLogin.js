import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const PassengerLogin = ({ isLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState(''); // State for storing username

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/login/passenger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        const { access_token, username } = data; // Assuming username is returned
        localStorage.setItem('access_token', access_token);
        console.log('Login successful! Access Token:', access_token);
        setUsername(username); // Set the username in state
        setError('');
        navigate('/passenger-dashboard');
      } else {
        const { error } = data;
        setError(error);
        console.error('Login failed:', error);
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-grow">
        <div className="bg-indigo-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              <FaSignInAlt className="inline-block mb-2" /> Passenger Login
            </h1>
            <p className="text-white text-lg">
              Welcome back! Log in to access your account and manage your bus journey bookings.
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12 bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-3xl font-bold mb-6 text-indigo-900 text-center">
              Passenger Login
            </h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link to="/passenger-register" className="font-medium text-indigo-900 hover:text-indigo-700">
                  Register as a passenger
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Display welcome message with username */}
        {username && (
          <div className="text-center text-gray-900 mt-4">
            <p>Welcome, {username}!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PassengerLogin;
