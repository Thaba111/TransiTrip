import React, { useState } from 'react';
import { FaUserCog } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import ViewAllBuses from './ViewAllBuses';  // Adjust path as needed
import ViewBookings from './ViewBookings';  // Adjust path as needed
import ViewScheduledBuses from './ViewScheduledBuses';  // Adjust path as needed

const AdminDashboard = () => {
    const [selectedOption, setSelectedOption] = useState('view-all-buses'); // State to manage selected menu option

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />

            <main className="flex-grow">
                <div className="bg-indigo-900 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            <FaUserCog className="inline-block mb-2 text-5xl" /> Admin Dashboard
                        </h1>
                        <p className="text-white text-lg">
                            Manage buses, bookings, and schedules as an admin.
                        </p>
                    </div>
                </div>

                <div className="flex">
                    {/* Left menu */}
                    <nav className="bg-gray-800 w-56 py-8 px-4 sm:px-6 lg:px-8">
                        <ul className="space-y-4">
                            <li>
                                <button
                                    onClick={() => setSelectedOption('view-all-buses')}
                                    className={`text-white block py-2 px-4 rounded-lg focus:outline-none ${
                                        selectedOption === 'view-all-buses' ? 'bg-blue-600' : ''
                                    }`}
                                >
                                    All Buses
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setSelectedOption('view-bookings')}
                                    className={`text-white block py-2 px-4 rounded-lg focus:outline-none ${
                                        selectedOption === 'view-bookings' ? 'bg-blue-600' : ''
                                    }`}
                                >
                                    All Bookings
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setSelectedOption('view-scheduled-buses')}
                                    className={`text-white block py-2 px-4 rounded-lg focus:outline-none ${
                                        selectedOption === 'view-scheduled-buses' ? 'bg-blue-600' : ''
                                    }`}
                                >
                                    Scheduled Buses
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* Right content */}
                    <div className="flex-grow bg-white py-8 px-4 sm:px-6 lg:px-8">
                        {selectedOption === 'view-all-buses' && (
                            <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden w-full">
                                <div className="bg-gray-200 px-6 py-8">
                                    <ViewAllBuses />
                                </div>
                            </div>
                        )}

                        {selectedOption === 'view-bookings' && (
                            <div className="max-w-2xl mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-white px-6 py-8">
                                    <ViewBookings />
                                </div>
                            </div>
                        )}

                        {selectedOption === 'view-scheduled-buses' && (
                            <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden w-full">
                                <div className="bg-gray-200 px-6 py-8">
                                    <ViewScheduledBuses />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
