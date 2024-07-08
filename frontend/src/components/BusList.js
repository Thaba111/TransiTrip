import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';

const BusList = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/buses')
            .then(response => setBuses(response.data))
            .catch(error => setError('Could not fetch buses'));
    }, []);

    const formik = useFormik({
        initialValues: {
            company_name: '',
            number_plate: '',
            no_of_seats: '',
            cost_per_seat: '',
            route: '',
            departure_time: ''
        },
        onSubmit: async (values) => {
            try {
                const response = await axios.put(`http://127.0.0.1:5000/buses/${selectedBus.id}`, values);
                setMessage(response.data.message);
                setError('');
                const updatedBuses = buses.map(bus => bus.id === selectedBus.id ? { ...bus, ...values } : bus);
                setBuses(updatedBuses);
                setSelectedBus(null);
            } catch (error) {
                setError(error.response?.data.error || 'An error occurred');
                setMessage('');
            }
        }
    });

    const handleDelete = async (busId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/buses/${busId}`);
            setMessage(response.data.message);
            setError('');
            setBuses(buses.filter(bus => bus.id !== busId));
        } catch (error) {
            setError(error.response?.data.error || 'An error occurred');
            setMessage('');
        }
    };

    const handleSelectBus = (bus) => {
        setSelectedBus(bus);
        formik.setValues({
            company_name: bus.company_name,
            number_plate: bus.number_plate,
            no_of_seats: bus.no_of_seats,
            cost_per_seat: bus.cost_per_seat,
            route: bus.route,
            departure_time: bus.departure_time || ''
        });
    };

    return (
        <div className="container mx-auto p-8">
            <h3 className="text-lg font-bold mb-4 text-center">Bus List</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {buses.map(bus => (
                    <div key={bus.id} className="bg-white shadow-md rounded-md p-4 flex flex-col justify-between">
                        <div className="flex items-center mb-2">
                            <img
                                src="/bus-image.jpeg" // Update with your image path
                                alt="Bus"
                                className="h-32 w-auto mx-auto" // Adjust the height as needed
                            />
                            <p className="text-xl font-semibold mt-2">{bus.company_name}</p>
                        </div>
                        <p className="text-gray-600"><strong>Number Plate:</strong> {bus.number_plate}</p>
                        <p className="text-gray-600"><strong>Route:</strong> {bus.route}</p>
                        <p className="text-gray-600"><strong>Departure Time:</strong> {bus.departure_time ? bus.departure_time : "Not Scheduled"}</p>
                        <div className="flex mt-4 justify-between">
                            <button
                                onClick={() => handleSelectBus(bus)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2 text-sm"
                            >
                                Shedule/Update
                            </button>
                            <button
                                onClick={() => handleDelete(bus.id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedBus && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
                        <h3 className="text-lg font-semibold mb-4">Update Bus</h3>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input
                                    id="company_name"
                                    name="company_name"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.company_name}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="number_plate" className="block text-sm font-medium text-gray-700">Number Plate</label>
                                <input
                                    id="number_plate"
                                    name="number_plate"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.number_plate}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="no_of_seats" className="block text-sm font-medium text-gray-700">Number of Seats</label>
                                <input
                                    id="no_of_seats"
                                    name="no_of_seats"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.no_of_seats}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="cost_per_seat" className="block text-sm font-medium text-gray-700">Cost per Seat</label>
                                <input
                                    id="cost_per_seat"
                                    name="cost_per_seat"
                                    type="number"
                                    step="0.01"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.cost_per_seat}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="route" className="block text-sm font-medium text-gray-700">Route</label>
                                <input
                                    id="route"
                                    name="route"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.route}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="departure_time" className="block text-sm font-medium text-gray-700">Departure Time</label>
                                <input
                                    id="departure_time"
                                    name="departure_time"
                                    type="datetime-local"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.departure_time}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedBus(null)}
                                    className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {message && <p className="text-green-500 mt-4">{message}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default BusList;
