import React, { useState, useEffect } from 'react';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/bookings')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);
                setBookings(data);
            })
            .catch(error => {
                setError(error.message);
                console.error('Error fetching bookings:', error);
            });
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">All Bookings</h2>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={`${process.env.PUBLIC_URL}/check.png`}
                                alt="Booking"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                                <p className="text-gray-800 text-lg font-semibold mb-2">{booking.username}</p>
                                <p className="text-gray-600 mb-2">{booking.company_name}</p>
                                <p className="text-gray-600 mb-2">Departure Time: {new Date(booking.departure_time).toLocaleString()}</p>
                                {/* Additional booking details can be added here */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewBookings;
