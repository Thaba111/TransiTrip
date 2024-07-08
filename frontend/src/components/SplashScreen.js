import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // Navigate to the home page after 3 seconds
    }, 4000); // Display for 4 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="text-center text-white">
        <img src="/download.png" alt="MySafari Logo" className="w-40 h-40 mx-auto mb-6 rounded-full shadow-lg" />
        <h1 className="text-4xl font-bold mb-4">Welcome to MySafari Booking App</h1>
        <p className="text-lg mb-8">Your ultimate bus travel management platform in Kenya</p>
        <div className="flex justify-center">
          <div className="inline-flex">
            <div className="w-3 h-3 bg-white rounded-full mr-1 animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full mr-1 animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
