import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetails = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Assuming you're storing the token in local storage
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Error fetching user. Please try again.');
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div>
      {error && <p>{error}</p>}
      {user ? (
        <div>
          <h2>User Details</h2>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDetails;
