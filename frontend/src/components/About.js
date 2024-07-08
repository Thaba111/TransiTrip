import React from 'react';
import Header from './Header';
import Footer from './Footer';

const About = () => {
  return (
    <div className="bg-blue-100 min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">About Us</h1>
        <p className="text-lg text-blue-700 mb-6">
          Welcome to MySafari App, your ultimate safari adventure booking platform. We are dedicated to providing the best travel experiences for our customers, with a focus on reliability, customer service, and uniqueness.
        </p>
        <p className="text-lg text-blue-700 mb-6">
          Founded in 2024, MySafari has come a long way from its beginnings. When we first started out, our passion for offering seamless and enjoyable travel experiences drove us to start our own business.
        </p>
        <p className="text-lg text-blue-700 mb-6">
          We hope you enjoy our services as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </p>
        <p className="text-lg text-blue-700">
          Sincerely,
          <br />
          The MySafari Team
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
