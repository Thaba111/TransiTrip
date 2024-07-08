
// export default BusSearch;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const BusSearch = () => {
    const [buses, setBuses] = useState([]);
    const [filteredBuses, setFilteredBuses] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [searchCriteria, setSearchCriteria] = useState({ boardingPoint: '', destination: '', travelDate: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5555/buses/all');
                setBuses(response.data);
            } catch (error) {
                setError('Could not fetch buses');
            }
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
    };

    const handleBookNow = (bus) => {
        navigate('/seats', { state: { bus } });
    };

    return (
        <>
            <div className="bg-red-500 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        <FaSearch /> Search for Buses
                    </h1>
                    <p className="text-white text-lg">
                        Find the perfect bus for your upcoming journey with our convenient search tool.
                    </p>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-red-500">Bus List</h2>
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="boardingPoint" className="block text-gray-700 font-bold mb-2">
                                Boarding Point:
                            </label>
                            <input
                                type="text"
                                name="boardingPoint"
                                id="boardingPoint"
                                value={searchCriteria.boardingPoint}
                                onChange={handleSearchChange}
                                required
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="destination" className="block text-gray-700 font-bold mb-2">
                                Destination:
                            </label>
                            <input
                                type="text"
                                name="destination"
                                id="destination"
                                value={searchCriteria.destination}
                                onChange={handleSearchChange}
                                required
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="travelDate" className="block text-gray-700 font-bold mb-2">
                                Day of Travel:
                            </label>
                            <input
                                type="date"
                                name="travelDate"
                                id="travelDate"
                                value={searchCriteria.travelDate}
                                onChange={handleSearchChange}
                                required
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500"
                            />
                        </div>
                        <div className="col-span-3">
                            <button
                                type="submit"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                            >
                                Search Buses
                            </button>
                        </div>
                    </div>
                </form>
                {filteredBuses.length > 0 ? (
                    filteredBuses.map((bus) => (
                        <div
                            key={bus.id}
                            className="flex items-center justify-between mb-4 p-4 bg-gray-100 rounded-md"
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
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Book Now
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-700">No buses available</p>
                )}
                {message && <p className="text-green-600 mt-4">{message}</p>}
                {error && <p className="text-red-600 mt-4">{error}</p>}
            </div>
        </>
    );
};

export default BusSearch;
