import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions here, like clearing local storage, updating state, etc.
    onLogout(); // This function should handle updating isLoggedIn state
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="bg-indigo-900 p-6 flex justify-between items-center">
      <div className="text-white text-3xl font-bold">MySafari</div>
      <nav className="flex space-x-6">
        <Link to="/" className="text-white text-lg">Home</Link>
        <Link to="/about" className="text-white text-lg">About</Link>
        <Link to="/services" className="text-white text-lg">Services</Link>
        <Link to="/contact" className="text-white text-lg">Contact</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-white bg-orange-500 py-2 px-4 rounded-md">Logout</button>
        ) : (
          <Link to="/login" className="text-white bg-orange-500 py-2 px-4 rounded-md">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
