import React, { useState, useEffect } from 'react';

const ViewAllBuses = () => {
    const [buses, setBuses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/buses')
            .then(response => response.json())
            .then(data => setBuses(data))
            .catch(error => {
                setError(error.message);
                console.error('Error fetching buses:', error);
            });
    }, []);

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">All Buses</h2>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {buses.map(bus => (
                        <div key={bus.id} className="bg-gray-200 rounded-lg shadow-md p-4">
                            <img
                                src={`${process.env.PUBLIC_URL}/bus-image.jpeg`}
                                alt="Bus Image"
                                className="w-full h-40 object-cover mb-4 rounded-lg"
                            />
                            <div className="text-gray-700">
                                <p className="font-semibold">{bus.company_name}</p>
                                <p className="text-sm">{bus.route}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewAllBuses;
