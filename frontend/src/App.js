// // // import React, { useState, useEffect } from 'react';
// // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // import Login from './components/Login';
// // // import AdminLogin from './components/AdminLogin';
// // // import AdminRegister from './components/AdminRegister';
// // // import AdminDashboard from './components/AdminDashboard';
// // // import PassengerRegister from './components/PassengerRegister';
// // // import PassengerLogin from './components/PassengerLogin';
// // // import PassengerDashboard from './components/PassengerDashboard';
// // // import DriverDashboard from './components/DriverDashboard';
// // // import DriverRegister from './components/DriverRegister';
// // // import DriverLogin from './components/DriverLogin';
// // // import PaymentForm from './components/PaymentForm';
// // // import BookingForm from './components/BookingForm';
// // // import BusSearch from './components/BusSearch';
// // // import SeatSelection from './components/SeatSelection';
// // // import BusList from './components/BusList';
// // // import HomePage from './components/HomePage';
// // // import About from './components/About';
// // // import Services from './components/Services';
// // // import Contact from './components/Contact';
// // // import SplashScreen from './components/SplashScreen';
// // // import UserDetails from './components/UserDetails';

// // // const App = () => {
// // //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// // //   const [showSplash, setShowSplash] = useState(true);

// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       setShowSplash(false);
// // //     }, 3000); // Show splash screen for 3 seconds

// // //     return () => clearTimeout(timer); // Cleanup timer
// // //   }, []);

// // //   const handleLogout = () => {
// // //     // Clear local storage or any authentication tokens
// // //     localStorage.removeItem('accessToken'); // Example if storing token

// // //     // Set isLoggedIn state to false
// // //     setIsLoggedIn(false);

// // //     // Redirect to the homepage or login page
// // //     return <Navigate to="/" />; // Assuming you're using React Router v6
// // //   };

// // //   return (
// // //     <Router>
// // //       <Routes>
// // //         {showSplash ? (
// // //           <Route path="/" element={<SplashScreen />} />
// // //         ) : (
// // //           <>
// // //             <Route path="/" element={<HomePage />} />
// // //             <Route path="/login" element={<Login />} />
// // //             <Route path="/admin/login" element={<AdminLogin isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
// // //             <Route path="/admin/register" element={<AdminRegister />} />
// // //             <Route path="/admin/dashboard" element={<AdminDashboard />} />
// // //             <Route path="/passenger-register" element={<PassengerRegister />} />
// // //             <Route path="/passenger-login" element={<PassengerLogin />} />
// // //             <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
// // //             <Route path="/driver-dashboard" element={<DriverDashboard />} />
// // //             <Route path="/driver-register" element={<DriverRegister />} />
// // //             <Route path="/driver-login" element={<DriverLogin />} />
// // //             <Route path="/booking" element={<BookingForm />} />
// // //             <Route path="/search" element={<BusSearch />} />
// // //             <Route path="/buses" element={<BusList />} />
// // //             <Route path="/seats" element={<SeatSelection />} />
// // //             <Route path="/payment" element={<PaymentForm />} />
// // //             <Route path="/about" element={<About />} />
// // //             <Route path="/services" element={<Services />} />
// // //             <Route path="/contact" element={<Contact />} />
// // //             <Route path="/user/:id" element={<UserDetails />} />
// // //           </>
// // //         )}
// // //       </Routes>
// // //     </Router>
// // //   );
// // // };

// // // export default App;
// // import React, { useState, useEffect } from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import Login from './components/Login';
// // import AdminLogin from './components/AdminLogin';
// // import AdminRegister from './components/AdminRegister';
// // import AdminDashboard from './components/AdminDashboard';
// // import PassengerRegister from './components/PassengerRegister';
// // import PassengerLogin from './components/PassengerLogin';
// // import PassengerDashboard from './components/PassengerDashboard';
// // import DriverDashboard from './components/DriverDashboard';
// // import DriverRegister from './components/DriverRegister';
// // import DriverLogin from './components/DriverLogin';
// // import PaymentForm from './components/PaymentForm';
// // import BookingForm from './components/BookingForm';
// // import BusSearch from './components/BusSearch';
// // import SeatSelection from './components/SeatSelection';
// // import BusList from './components/BusList';
// // import HomePage from './components/HomePage';
// // import About from './components/About';
// // import Services from './components/Services';
// // import Contact from './components/Contact';
// // import SplashScreen from './components/SplashScreen';
// // import UserDetails from './components/UserDetails';

// // const App = () => {
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [showSplash, setShowSplash] = useState(true);

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setShowSplash(false);
// //     }, 3000); // Show splash screen for 3 seconds

// //     return () => clearTimeout(timer); // Cleanup timer
// //   }, []);

// //   const handleLogout = () => {
// //     // Clear local storage or any authentication tokens
// //     localStorage.removeItem('accessToken'); // Example if storing token

// //     // Set isLoggedIn state to false
// //     setIsLoggedIn(false);

// //     // Redirect to the homepage or login page
// //     return <Navigate to="/" replace />; // Using replace to prevent back navigation
// //   };

// //   return (
// //     <Router>
// //       <Routes>
// //         {showSplash ? (
// //           <Route path="/" element={<SplashScreen />} />
// //         ) : (
// //           <>
// //             <Route path="/" element={<HomePage />} />
// //             <Route path="/login" element={<Login />} />
// //             <Route path="/admin/login" element={<AdminLogin isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
// //             <Route path="/admin/register" element={<AdminRegister />} />
// //             <Route path="/admin/dashboard" element={<AdminDashboard />} />
// //             <Route path="/passenger-register" element={<PassengerRegister />} />
// //             <Route path="/passenger-login" element={<PassengerLogin />} />
// //             <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
// //             <Route path="/driver-dashboard" element={<DriverDashboard />} />
// //             <Route path="/driver-register" element={<DriverRegister />} />
// //             <Route path="/driver-login" element={<DriverLogin />} />
// //             <Route path="/booking" element={<BookingForm />} />
// //             <Route path="/search" element={<BusSearch />} />
// //             <Route path="/buses" element={<BusList />} />
// //             <Route path="/seats" element={<SeatSelection />} />
// //             <Route path="/payment" element={<PaymentForm />} />
// //             <Route path="/about" element={<About />} />
// //             <Route path="/services" element={<Services />} />
// //             <Route path="/contact" element={<Contact />} />
// //             <Route path="/user/:id" element={<UserDetails />} />
// //           </>
// //         )}
// //       </Routes>
// //     </Router>
// //   );
// // };

// // export default App;



// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login';
// import AdminLogin from './components/AdminLogin';
// import AdminRegister from './components/AdminRegister';
// import AdminDashboard from './components/AdminDashboard';
// import PassengerRegister from './components/PassengerRegister';
// import PassengerLogin from './components/PassengerLogin';
// import PassengerDashboard from './components/PassengerDashboard';
// import DriverDashboard from './components/DriverDashboard';
// import DriverRegister from './components/DriverRegister';
// import DriverLogin from './components/DriverLogin';
// import PaymentForm from './components/PaymentForm';
// import BookingForm from './components/BookingForm';
// import BusSearch from './components/BusSearch';
// import SeatSelection from './components/SeatSelection';
// import BusList from './components/BusList';
// import HomePage from './components/HomePage';
// import About from './components/About';
// import Services from './components/Services';
// import Contact from './components/Contact';
// import SplashScreen from './components/SplashScreen';
// import UserDetails from './components/UserDetails';

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showSplash, setShowSplash] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowSplash(false);
//     }, 3000); // Show splash screen for 3 seconds

//     return () => clearTimeout(timer); // Cleanup timer
//   }, []);

//   const handleLogout = () => {
//     // Clear local storage or any authentication tokens
//     localStorage.removeItem('accessToken'); // Example if storing token

//     // Set isLoggedIn state to false
//     setIsLoggedIn(false);

//     // Redirect to the homepage or login page
//     return <Navigate to="/" replace />; // Using replace to prevent back navigation
//   };

//   return (
//     <Router>
//       <Routes>
//         {showSplash ? (
//           <Route path="/" element={<SplashScreen />} />
//         ) : (
//           <>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/admin/login" element={<AdminLogin isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
//             <Route path="/admin/register" element={<AdminRegister />} />
//             <Route path="/admin/dashboard" element={<AdminDashboard />} />
//             <Route path="/passenger-register" element={<PassengerRegister />} />
//             <Route path="/passenger-login" element={<PassengerLogin />} />
//             <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
//             <Route path="/driver-dashboard" element={<DriverDashboard />} />
//             <Route path="/driver-register" element={<DriverRegister />} />
//             <Route path="/driver-login" element={<DriverLogin />} />
//             <Route path="/booking" element={<BookingForm />} />
//             <Route path="/search" element={<BusSearch />} />
//             <Route path="/buses" element={<BusList />} />
//             <Route path="/seats" element={<SeatSelection />} />
//             <Route path="/payment" element={<PaymentForm />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/services" element={<Services />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/user/:id" element={<UserDetails />} />
//           </>
//         )}
//       </Routes>
//     </Router>
//   );
// };

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import PassengerRegister from './components/PassengerRegister';
import PassengerLogin from './components/PassengerLogin';
import PassengerDashboard from './components/PassengerDashboard';
import DriverDashboard from './components/DriverDashboard';
import DriverRegister from './components/DriverRegister';
import DriverLogin from './components/DriverLogin';
import PaymentForm from './components/PaymentForm';
import BookingForm from './components/BookingForm';
import BusSearch from './components/BusSearch';
import SeatSelection from './components/SeatSelection';
import BusList from './components/BusList';
import HomePage from './components/HomePage';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import SplashScreen from './components/SplashScreen';
import UserDetails from './components/UserDetails';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  const handleLogout = () => {
    // Clear local storage or any authentication tokens
    localStorage.removeItem('accessToken'); // Example if storing token

    // Set isLoggedIn state to false
    setIsLoggedIn(false);

    // Redirect to the homepage or login page
    return <Navigate to="/" replace />; // Using replace to prevent back navigation
  };

  return (
    <Router>
      <Routes>
        {showSplash ? (
          <Route path="/" element={<SplashScreen />} />
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/passenger-register" element={<PassengerRegister />} />
            <Route path="/passenger-login" element={<PassengerLogin />} />
            <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/driver-register" element={<DriverRegister />} />
            <Route path="/driver-login" element={<DriverLogin />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/search" element={<BusSearch isLoggedIn={isLoggedIn} />} /> {/* Pass isLoggedIn prop if needed */}
            <Route path="/buses" element={<BusList />} />
            <Route path="/seats" element={<SeatSelection />} />
            <Route path="/payment" element={<PaymentForm />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/user/:id" element={<UserDetails />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
