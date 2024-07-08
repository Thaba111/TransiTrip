import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserLock } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const AdminLogin = ({ isLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://127.0.0.1:5000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (response.ok) {
        const { access_token } = data;
        localStorage.setItem('access_token', access_token);
        console.log('Login successful! Access Token:', access_token);
        setError('');
        navigate('/admin/dashboard'); // Navigate to admin dashboard on success
      } else {
        const { error } = data;
        setError(error || 'Login failed. Please check your credentials.');
        console.error('Admin Login failed:', error);
      }
    } catch (error) {
      console.error('An error occurred during admin login:', error);
      setError('An error occurred during admin login');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-grow">
        <div className="bg-indigo-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4"><FaUserLock className="inline-block mb-2" /> Admin Login</h1>
            <p className="text-white text-lg">Log in to manage admin functionalities.</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12 bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-3xl font-bold mb-6 text-indigo-900 text-center">
              Admin Login
            </h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              </div>
            </form>
            <p className="mt-4 text-gray-600 text-center">
              <Link to="/admin/register" className="text-indigo-900 font-bold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
