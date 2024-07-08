import React, { useState } from 'react';
import { FaUserCog } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import AddBusForm from './AddBusForm'; // Adjust path as needed
import BusList from './BusList'; // Adjust path as needed
// import DriverProfile from './DriverProfile'; // Adjust path as needed

const DriverDashboard = () => {
    const [selectedOption, setSelectedOption] = useState('addBus'); // State to manage selected menu option

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />

            <main className="flex-grow">
                <div className="bg-indigo-900 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            <FaUserCog className="inline-block mb-2 text-5xl" /> Driver's Dashboard
                        </h1>
                        <p className="text-white text-lg">
                            Manage bus schedules and operations as a driver.
                        </p>
                    </div>
                </div>

                <div className="flex">
                    {/* Left menu */}
                    <nav className="bg-gray-800 w-56 py-8 px-4 sm:px-6 lg:px-8">
                        <ul className="space-y-4">
                            <li>
                                <button
                                    onClick={() => setSelectedOption('addBus')}
                                    className={`text-white block py-2 px-4 rounded-lg focus:outline-none ${
                                        selectedOption === 'addBus' ? 'bg-blue-600' : ''
                                    }`}
                                >
                                    Add Bus
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setSelectedOption('viewBuses')}
                                    className={`text-white block py-2 px-4 rounded-lg focus:outline-none ${
                                        selectedOption === 'viewBuses' ? 'bg-blue-600' : ''
                                    }`}
                                >
                                    View Buses
                                </button>
                            </li>
                            {/* <li>
                                <button
                                    onClick={() => setSelectedOption('profile')}
                                    className={`text-white block py-2 px-4 rounded-lg focus:outline-none ${
                                        selectedOption === 'profile' ? 'bg-blue-600' : ''
                                    }`}
                                >
                                    Driver Profile
                                </button>
                            </li> */}
                        </ul>
                    </nav>

                    {/* Right content */}
                    <div className="flex-grow bg-white py-8 px-4 sm:px-6 lg:px-8">
                        {selectedOption === 'addBus' && (
                            <div className="max-w-lg mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-white px-6 py-8">
                                    <AddBusForm />
                                </div>
                            </div>
                        )}

                        {selectedOption === 'viewBuses' && (
                            <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden w-full">
                                <div className="bg-gray-200 px-6 py-8">
                                    <BusList />
                                </div>
                            </div>
                        )}

                        {/* {selectedOption === 'profile' && (
                            <div className="max-w-lg mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-white px-6 py-8">
                                    <DriverProfile />
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DriverDashboard;
