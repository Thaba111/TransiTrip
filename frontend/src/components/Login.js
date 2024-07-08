

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt, FaBus, FaUserLock } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const Login = ({ isLoggedIn }) => {
  const [role, setRole] = useState('passenger'); // Default role is set to passenger
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = getLoginEndpoint(role);

    try {
      const response = await fetch(`http://127.0.0.1:5000/login/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        const { access_token, user_id } = data; // Assuming backend sends user_id along with access_token
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user_id', user_id); // Store user_id in localStorage
        console.log('Login successful! Access Token:', access_token);
        setError('');
        navigate(`/${role}-dashboard`); // Redirect to respective dashboard
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

  const getLoginEndpoint = (role) => {
    switch (role) {
      case 'passenger':
        return 'passenger';
      case 'driver':
        return 'driver';
      case 'admin':
        return 'admin';
      default:
        return 'passenger';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-indigo-900">
              {role === 'passenger' && <><FaSignInAlt className="inline-block mb-2 text-indigo-600" /> Passenger Login</>}
              {role === 'driver' && <><FaBus className="inline-block mb-2 text-indigo-600" /> Driver Login</>}
              {role === 'admin' && <><FaUserLock className="inline-block mb-2 text-indigo-600" /> Admin Login</>}
            </h1>
            <p className="text-lg text-gray-700">
              {role === 'passenger' && 'Welcome back! Log in to access your account and manage your bus journey bookings.'}
              {role === 'driver' && 'Log in to manage your bus journeys and schedules.'}
              {role === 'admin' && 'Log in to manage admin functionalities.'}
            </p>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-center bg-indigo-900 py-4">
              <button
                className={`text-lg font-medium text-white px-6 py-2 rounded-md focus:outline-none ${role === 'passenger' ? 'bg-indigo-700' : 'bg-indigo-900'}`}
                onClick={() => setRole('passenger')}
              >
                Passenger
              </button>
              <button
                className={`text-lg font-medium text-white px-6 py-2 rounded-md focus:outline-none ml-2 ${role === 'driver' ? 'bg-indigo-700' : 'bg-indigo-900'}`}
                onClick={() => setRole('driver')}
              >
                Driver
              </button>
              <button
                className={`text-lg font-medium text-white px-6 py-2 rounded-md focus:outline-none ml-2 ${role === 'admin' ? 'bg-indigo-700' : 'bg-indigo-900'}`}
                onClick={() => setRole('admin')}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              </div>
            </form>

            <div className="bg-gray-100 px-6 py-4 sm:px-8 flex justify-center items-center">
              <p className="text-sm text-gray-600">
                {role === 'passenger' && (
                  <>
                    Don't have an account?{' '}
                    <Link to="/passenger-register" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Register as a passenger
                    </Link>
                  </>
                )}
                {role === 'driver' && (
                  <>
                    Don't have an account?{' '}
                    <Link to="/driver-register" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Register as a driver
                    </Link>
                  </>
                )}
                {role === 'admin' && (
                  <>
                    <Link to="/admin/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Register as an admin
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
