import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaBus, FaChair } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import PaymentForm from './PaymentForm';
import BookingForm from './BookingForm';

const SeatSelection = () => {
  const location = useLocation();
  const bus = location.state;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalFare, setTotalFare] = useState(0);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [userId, setUserId] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [costPerSeat, setCostPerSeat] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserId(token);
    }
  }, []);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/buses/seats/${bus.id}`);
        setAvailableSeats(response.data.available_seats);
        setBookedSeats(response.data.booked_seats || []);
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };
    if (bus && bus.id) {
      fetchSeats();
    }
  }, [bus]);

  useEffect(() => {
    const fetchCostPerSeat = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/buses/cost-per-seat/${bus.id}`);
        setCostPerSeat(response.data.cost_per_seat);
      } catch (error) {
        console.error('Error fetching cost per seat:', error);
      }
    };
    if (bus && bus.id) {
      fetchCostPerSeat();
    }
  }, [bus]);

  const handleSeatClick = (seat) => {
    const isSelected = selectedSeats.some((selectedSeat) => selectedSeat.seatNumber === seat);
    const farePerSeat = parseFloat(costPerSeat);

    if (!isSelected) {
      setSelectedSeats([...selectedSeats, { seatNumber: seat, fare: farePerSeat }]);
      setTotalFare(totalFare + farePerSeat);
    } else {
      setSelectedSeats(selectedSeats.filter((selectedSeat) => selectedSeat.seatNumber !== seat));
      setTotalFare(totalFare - farePerSeat);
    }
  };

  const handleBookingConfirmed = () => {
    setBookingConfirmation('Your booking has been confirmed!');
    setSelectedSeats([]);
    setTotalFare(0);
    setAvailableSeats(availableSeats.filter((seat) => !selectedSeats.some((selectedSeat) => selectedSeat.seatNumber === seat)));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow">
        <div className="bg-indigo-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Seat Selection</h1>
            <p className="text-white text-lg">Choose your seats and proceed to payment</p>
          </div>
        </div>
        <div className="py-12 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center">
              <FaBus className="text-4xl text-indigo-900 mb-4" />
              <h2 className="text-3xl font-bold text-indigo-900 mb-4">{bus.company_name}</h2>
              <p className="text-gray-700 mb-4">Route: {bus.route}</p>
              <p className="text-gray-700 mb-4">Departure Time: {new Date(bus.departure_time).toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-8">
              {availableSeats.map((seat) => (
                <div
                  key={seat}
                  className={`p-4 border rounded cursor-pointer ${
                    bookedSeats.includes(seat) ? 'bg-red-500 text-white' : 
                    selectedSeats.some((s) => s.seatNumber === seat) ? 'bg-green-500 text-white' : 
                    'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => !bookedSeats.includes(seat) && handleSeatClick(seat)}
                >
                  <FaChair className="mx-auto text-2xl" />
                  <p className="mt-2 text-center">{seat}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center">
              <p className="text-lg font-semibold">Total Fare: KSH. {totalFare.toFixed(2)}</p>
            </div>
            {selectedSeats.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-700">Selected Seats</h3>
                <ul className="mt-4">
                  {selectedSeats.map((seat) => (
                    <li key={seat.seatNumber} className="text-gray-700">
                      Seat {seat.seatNumber} - KSH. {seat.fare.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <PaymentForm
                  busId={bus.id}
                  selectedSeats={selectedSeats}
                  totalFare={totalFare}
                  onBookingConfirmed={handleBookingConfirmed}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <BookingForm selectedBus={bus} selectedSeats={selectedSeats} />
      <Footer />
    </div>
  );
};

export default SeatSelection;
