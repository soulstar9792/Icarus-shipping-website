import React from 'react';
import landingBackground from '../assets/landing-background.jpg'; // Ensure this path points correctly to your background image

const Home = () => {
  return (
    <div className="bg-dark-bg text-white">
      {/* Landing View Section with Background Image */}
      <section 
        className="flex flex-col items-center justify-center h-screen text-center relative"
        style={{
          backgroundImage: `url(${landingBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Optional overlay for better text readability */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Welcome to Icarus Shipping</h1>
          <p className="text-lg mb-8">Your gateway to swift and reliable shipping solutions.</p>
          <button className="bg-dark-orange text-white px-6 py-2 rounded">Get Started</button>
        </div>
      </section>

      {/* How To Section */}
      <section className="py-20 px-10">
        <h2 className="text-4xl text-center mb-8">How It Works</h2>
        <p className="text-center mb-8">Follow these simple steps to get started with our shipping services.</p>
        {/* Add steps or graphics as necessary */}
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-800">
        <h2 className="text-4xl text-center mb-8">Why Choose Us?</h2>
        <ul className="space-y-4">
          <li className="text-center">✅ 24/7 Support</li>
          <li className="text-center">✅ Fast and Reliable</li>
          <li className="text-center">✅ Affordable Pricing</li>
        </ul>
      </section>

      {/* Price Section */}
      <section className="py-20">
        <h2 className="text-4xl text-center mb-8">Pricing</h2>
        <p className="text-center mb-8">Choose a pricing plan that suits your needs.</p>
        {/* Pricing cards can be added here */}
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-800">
        <h2 className="text-4xl text-center mb-8">Frequently Asked Questions</h2>
        {/* Add FAQ items here */}
      </section>

      {/* Customer Feedback Section */}
      <section className="py-20">
        <h2 className="text-4xl text-center mb-8">Customer Feedback</h2>
        {/* Add customer reviews or testimonials here */}
      </section>

      {/* Get Started Section */}
      <section className="py-20 bg-dark-orange text-center text-black">
        <h2 className="text-4xl mb-4">Ready to Ship?</h2>
        <p className="mb-8">Join us today and start shipping with ease!</p>
        <button className="bg-loyal-blue text-white px-6 py-2 rounded">Register Now</button>
      </section>

      {/* Footer Section */}
      <footer className="py-10 text-center">
        <p>&copy; 2024 Icarus Shipping. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;