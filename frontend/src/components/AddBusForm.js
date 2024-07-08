import React, { useState } from 'react';
import axios from 'axios';

const AddBusForm = ({ onAddNewBus }) => {
    const [formData, setFormData] = useState({
        company_name: '',
        number_plate: '',
        no_of_seats: '',
        cost_per_seat: '',
        route: '',
        driver_id: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/buses', formData);
            console.log('Response:', response.data);
            alert('Bus created successfully!');
            onAddNewBus(response.data); // Pass new bus data to parent component
            setFormData({
                company_name: '',
                number_plate: '',
                no_of_seats: '',
                cost_per_seat: '',
                route: '',
                driver_id: ''
            });
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                alert(`Error: ${error.response.data.error}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                alert('No response received from server');
            } else {
                console.error('Error setting up request:', error.message);
                alert('Error setting up request');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 mb-4">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Bus</h3>
            {Object.keys(formData).map((key) => (
                <div className="mb-4" key={key}>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
                        {key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
                        id={key}
                        type={key === 'no_of_seats' || key === 'cost_per_seat' ? 'number' : 'text'}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        required
                    />
                </div>
            ))}
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
            >
                Add Bus
            </button>
        </form>
    );
};

export default AddBusForm;
