import React from 'react';

const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    // Redirect or handle logout
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
