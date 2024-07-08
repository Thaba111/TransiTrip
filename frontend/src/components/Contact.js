import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const Contact = () => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center bg-blue-200 rounded-lg p-6">
              <FaPhoneAlt className="text-3xl text-blue-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-blue-800 mb-2">Phone</h2>
                <p className="text-lg text-blue-700">+254 123 456 789</p>
              </div>
            </div>
            <div className="flex items-center justify-center bg-blue-200 rounded-lg p-6">
              <FaEnvelope className="text-3xl text-blue-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-blue-800 mb-2">Email</h2>
                <p className="text-lg text-blue-700">info@mysafari.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center bg-blue-200 rounded-lg p-6">
              <FaMapMarkerAlt className="text-3xl text-blue-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-blue-800 mb-2">Location</h2>
                <p className="text-lg text-blue-700">123 Safari Lane, Nairobi, Kenya</p>
              </div>
            </div>
          </div>
          <form className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Send Us a Message</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-blue-700 font-semibold mb-2" htmlFor="name">Name</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  id="name"
                  name="name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-blue-700 font-semibold mb-2" htmlFor="email">Email</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  id="email"
                  name="email"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-blue-700 font-semibold mb-2" htmlFor="message">Message</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="message"
                name="message"
                rows="6"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                type="submit"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
