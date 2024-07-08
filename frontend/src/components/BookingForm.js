import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';

const BookingForm = ({ selectedBus, selectedSeats }) => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            company_name: '',
            number_plate: '',
            seat_numbers: [], // Change to array to store multiple seat numbers
            mpesa_code: '',
            bus_id: '',
            departure_time: '',
            route: '',
            cost_per_seat: '',
        },
        onSubmit: async (values) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/bookings', values);

        if (response.data.success) {
            setMessage(response.data.message || 'Booking successful.');
            setError('');
            formik.resetForm();
        } else {
            setError(response.data.error || 'Booking failed. Please try again.');
            setMessage('');
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        setError(error.response?.data.error || 'An error occurred');
        setMessage('');
    }
}

    });

    useEffect(() => {
        if (selectedBus) {
            formik.setValues((prevValues) => ({
                ...prevValues,
                company_name: selectedBus.company_name,
                number_plate: selectedBus.number_plate,
                bus_id: selectedBus.id,
                departure_time: selectedBus.departure_time,
                route: selectedBus.route,
                cost_per_seat: selectedBus.cost_per_seat,
            }));
        }
        if (selectedSeats && selectedSeats.length > 0) {
            // Map selected seat numbers to an array for form submission
            const seatNumbers = selectedSeats.map(seat => seat.seatNumber);
            formik.setValues((prevValues) => ({
                ...prevValues,
                seat_numbers: seatNumbers,
            }));
        }
    }, [selectedBus, selectedSeats]);

    const handleSeatNumberChange = (e) => {
        const { value } = e.target;
        formik.setFieldValue('seat_numbers', [value]); // Update seat_numbers as an array of selected seat numbers
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Book Seat(s)</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name:</label>
                    <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        value={formik.values.company_name}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="number_plate" className="block text-sm font-medium text-gray-700">Number Plate:</label>
                    <input
                        type="text"
                        id="number_plate"
                        name="number_plate"
                        value={formik.values.number_plate}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="seat_numbers" className="block text-sm font-medium text-gray-700">Seat Number(s):</label>
                    <select
                        id="seat_numbers"
                        name="seat_numbers"
                        multiple
                        value={formik.values.seat_numbers}
                        onChange={handleSeatNumberChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {selectedSeats.map(seat => (
                            <option key={seat.id} value={seat.seatNumber}>
                                {seat.seatNumber}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="mpesa_code" className="block text-sm font-medium text-gray-700">M-Pesa Code:</label>
                    <input
                        type="text"
                        id="mpesa_code"
                        name="mpesa_code"
                        value={formik.values.mpesa_code}
                        onChange={formik.handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <input type="hidden" name="bus_id" value={formik.values.bus_id} />
                <input type="hidden" name="departure_time" value={formik.values.departure_time} />
                <input type="hidden" name="route" value={formik.values.route} />
                <input type="hidden" name="cost_per_seat" value={formik.values.cost_per_seat} />
                <button type="submit" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none w-full">Book Seat(s)</button>
            </form>
            {message && <p className="text-green-500 mt-4 text-center">{message}</p>}
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
    );
};

export default BookingForm;

