

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaMoneyBillWave, FaCheckCircle, FaMinus, FaExpand } from 'react-icons/fa';

const PaymentForm = ({ busId, selectedSeats, totalFare }) => {
  const [phone, setPhone] = useState('');
  const [amount] = useState(totalFare);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [minimized, setMinimized] = useState(false); // State for minimization
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post('http://localhost:5000/pay', {
        phone,
        amount
      });

      if (res.data.ResponseCode === '0') {
        setMessage('Payment request accepted. Please check your phone to complete the payment.');
        setTimeout(handlePaymentSuccess, 2000); // Delay for user to read message before closing
      } else {
        setError('Payment request failed. Please try again.');
      }
    } catch (err) {
      setError('Error processing payment. Please try again.');
    }
  };

  const handlePaymentSuccess = () => {
    setMessage('Payment successful. Redirecting to seat selection...');
    setTimeout(() => {
      navigate('/seats', { state: { busId, selectedSeats, disableSelection: true } });
    }, 2000); // Redirect after 2 seconds for user to read the message
  };

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page, assuming it's the seat selection page
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  return (
    <div className={`absolute inset-0 flex items-center justify-center ${minimized ? 'hidden' : ''}`}>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center">Payment Form</h2>
          <button
            onClick={toggleMinimize}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
            title={minimized ? 'Expand' : 'Minimize'}
          >
            {minimized ? <FaExpand className="text-xl" /> : <FaMinus className="text-xl" />}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
              <FaPhone className="inline mr-2" /> Phone Number:
            </label>
            <input
              type="text"
              id="phone"
              className="w-full p-2 border border-gray-300 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">
              <FaMoneyBillWave className="inline mr-2" /> Amount (KSH):
            </label>
            <input
              type="text"
              id="amount"
              className="w-full p-2 border border-gray-300 rounded"
              value={amount}
              readOnly
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-3 px-4 rounded hover:bg-green-600 transition-colors duration-300"
          >
            <FaCheckCircle className="inline mr-2" /> Pay
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default PaymentForm;
