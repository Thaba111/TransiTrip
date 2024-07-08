// HeroSection.js

import React from 'react';

const HeroSection = () => {
    return (
        <section className="bg-blue-600 text-white py-20">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4">Welcome to Transit Travels</h2>
                <p className="text-lg mb-8">Book your bus tickets hassle-free!</p>
                <button className="bg-white text-blue-600 py-2 px-6 rounded-full font-semibold hover:bg-blue-100 hover:text-blue-800">Get Started</button>
            </div>
        </section>
    );
}

export default HeroSection;
