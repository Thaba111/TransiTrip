import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav style={styles.navBar}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logo}>
          MySafari App
        </Link>
        <div>
          {isLoggedIn ? (
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          ) : (
            <button onClick={handleLoginClick} style={styles.button}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navBar: {
    backgroundColor: '#333',
    padding: '10px 20px',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#fff',
    fontSize: '1.5rem',
    textDecoration: 'none',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default NavBar;
