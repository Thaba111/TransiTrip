import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-6 text-center">
    <div className="container mx-auto">
      <div className="flex justify-center space-x-6 mb-4">
        <Link to="/privacy-policy" className="text-white">Privacy Policy</Link>
        <Link to="/terms-of-service" className="text-white">Terms of Service</Link>
        <Link to="/faq" className="text-white">FAQ</Link>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white">
          <i className="fab fa-facebook fa-2x"></i>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
          <i className="fab fa-twitter fa-2x"></i>
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
          <i className="fab fa-instagram fa-2x"></i>
        </a>
      </div>
      <p>© {new Date().getFullYear()} MySafari. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
