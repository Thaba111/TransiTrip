


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import Modal from 'react-modal';

const PassengerDashboard = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({ boardingPoint: '', destination: '', travelDate: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchBuses = () => {
      axios
        .get('http://127.0.0.1:5000/buses')
        .then((response) => setBuses(response.data))
        .catch(() => setError('Could not fetch buses'));
    };

    fetchBuses();
  }, []);

  const handleSearchChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const { boardingPoint, destination, travelDate } = searchCriteria;
    const filtered = buses.filter((bus) =>
      bus.route.includes(`${boardingPoint}-${destination}`) &&
      bus.departure_time &&
      bus.departure_time.startsWith(travelDate)
    );

    setFilteredBuses(filtered);
    setMessage(filtered.length === 0 ? 'No buses found for the specified route and date' : '');
    setModalIsOpen(true);
  };

  const handleBookNow = (bus) => {
    navigate('/seats', { state: bus }); // Navigate to '/seats' with bus data in location state
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-grow">
        <div className="bg-indigo-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              <FaSearch className="inline-block mb-2" /> Search for Buses
            </h1>
            <p className="text-white text-lg">
              Find the perfect bus for your upcoming journey with our convenient search tool.
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12 bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 text-indigo-900 text-center">Bus Search</h2>
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                <p>{message}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSearch} className="flex space-x-4">
              <div className="flex flex-col">
                <label htmlFor="boardingPoint" className="text-sm font-medium text-gray-700">
                  Boarding Point
                </label>
                <input
                  id="boardingPoint"
                  name="boardingPoint"
                  type="text"
                  value={searchCriteria.boardingPoint}
                  onChange={handleSearchChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter boarding point"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="destination" className="text-sm font-medium text-gray-700">
                  Destination
                </label>
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  value={searchCriteria.destination}
                  onChange={handleSearchChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter destination"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="travelDate" className="text-sm font-medium text-gray-700">
                  Day of Travel
                </label>
                <input
                  id="travelDate"
                  name="travelDate"
                  type="date"
                  value={searchCriteria.travelDate}
                  onChange={handleSearchChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Search Buses
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Bus List"
        className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
          <h2 className="text-2xl font-bold mb-6 text-indigo-900">Available Buses</h2>
          <button onClick={closeModal} className="text-red-500 absolute top-4 right-4">Close</button>
          {filteredBuses.length > 0 ? (
            filteredBuses.map((bus) => (
              <div
                key={bus.id}
                className="flex items-center justify-between mb-4 p-4 bg-gray-100 rounded-md shadow-md"
              >
                <div>
                  <p className="text-gray-700 font-semibold">Company Name: {bus.company_name}</p>
                  <p className="text-gray-700">Plate Number: {bus.number_plate}</p>
                  <p className="text-gray-700">Route: {bus.route}</p>
                  <p className="text-gray-700">
                    Departure Time: {new Date(bus.departure_time).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleBookNow(bus)}
                  className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded"
                >
                  Book Now
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No buses available</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PassengerDashboard;
