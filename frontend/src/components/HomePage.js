import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const HomePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleNavigation = (dashboardPath, role) => {
    if (isLoggedIn) {
      navigate(dashboardPath);
    } else {
      navigate(`/login/${role}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center bg-white bg-opacity-90 p-10 rounded-lg shadow-2xl">
          <div className="lg:w-1/2 p-6">
            <h1 className="text-5xl font-bold text-indigo-900 mb-6">Welcome to MySafari</h1>
            <p className="text-xl text-gray-800 mb-10">
              Your ultimate bus travel management platform in Kenya. We provide seamless booking, reliable schedules, and secure payment options to ensure a smooth journey for you.
            </p>
            <button
              onClick={() => handleNavigation('/book-trip', 'passenger')}
              className="bg-indigo-900 text-white font-bold py-3 px-6 rounded-md shadow-lg hover:bg-indigo-800 transition duration-300"
            >
              Book a Trip   
            </button>
          </div>
          <div className="lg:w-1/2 p-6">
            <img src="\bushome.jpg" alt="Bus Illustration" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
        </div>
        <div className="mt-12 text-center max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-indigo-900 mb-4">Why Choose MySafari?</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Easy Booking</h3>
                <p className="text-gray-700">Effortlessly book your bus tickets with just a few clicks, anytime and anywhere.</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Reliable Schedules</h3>
                <p className="text-gray-700">We provide accurate and reliable bus schedules to ensure you reach your destination on time.</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Secure Payment</h3>
                <p className="text-gray-700">Our platform offers secure payment options to protect your financial information.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
