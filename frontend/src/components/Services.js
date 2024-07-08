import React from 'react';
import { FaBus, FaUserShield, FaRoute, FaMoneyBillWave, FaClipboardList, FaCogs } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const Services = () => {
  return (
    <div className="bg-blue-100 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-6 text-center">Our Services</h1>
        <p className="text-xl text-gray-800 mb-8 text-center">
          At MySafari, we offer a comprehensive range of services designed to provide you with the ultimate bus travel experience. Our services include:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <FaBus className="text-4xl text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Easy Bus Booking</h2>
            <p className="text-lg text-gray-700">
              Check bus availability and book your seat online with just a few clicks, eliminating the need to wait at bus terminals.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <FaClipboardList className="text-4xl text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Real-Time Seat Availability</h2>
            <p className="text-lg text-gray-700">
              Know exactly which seats are available before you book, ensuring you get the best spot for your journey.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <FaUserShield className="text-4xl text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Manage Your Bookings</h2>
            <p className="text-lg text-gray-700">
              Update or cancel your bookings effortlessly from your account dashboard.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <FaMoneyBillWave className="text-4xl text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Secure Payments</h2>
            <p className="text-lg text-gray-700">
              Pay securely through M-Pesa and get instant confirmation of your seat reservation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <FaRoute className="text-4xl text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Travel Schedules</h2>
            <p className="text-lg text-gray-700">
              Access detailed bus schedules, including departure and arrival times, to plan your travel efficiently.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <FaCogs className="text-4xl text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Bus Management</h2>
            <p className="text-lg text-gray-700">
              Register new buses, manage schedules, and keep your fleet information up-to-date with ease.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-2xl text-gray-800 mb-4">
            Ready to Transform Your Bus Travel Experience?
          </p>
          <p className="text-lg text-gray-700">
            Join us at MySafari and discover a new way to manage and experience bus travel in Kenya. Whether you're a passenger looking for a convenient booking solution, a driver managing a fleet, or an administrator overseeing operations, we've got you covered.
          </p>
          <div className="mt-6">
            <a href="/contact" className="inline-block py-3 px-6 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-300">
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
