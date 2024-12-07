import React from "react";
import { FaShippingFast, FaBoxOpen, FaQuoteRight } from "react-icons/fa";

const ReadyToShip = () => {
  return (
    <section className="py-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold mb-6">Ready to Ship?</h2>
        <p className="text-lg mb-12">
          Experience fast and efficient parcel ships with our all-in-one solution.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="border p-6 rounded-lg shadow hover:bg-gray-100 transition">
            <FaShippingFast className="text-4xl mb-4 mx-auto text-blue-600" />
            <h3 className="text-xl font-semibold">Fast ships</h3>
            <p>Get your packages delivered right on time with our expedited services.</p>
          </div>
          <div className="border p-6 rounded-lg shadow hover:bg-gray-100 transition">
            <FaBoxOpen className="text-4xl mb-4 mx-auto text-green-600" />
            <h3 className="text-xl font-semibold">Flexible Options</h3>
            <p>Choose from various carriers and services that suit your ships needs.</p>
          </div>
          <div className="border p-6 rounded-lg shadow hover:bg-gray-100 transition">
            <FaQuoteRight className="text-4xl mb-4 mx-auto text-purple-600" />
            <h3 className="text-xl font-semibold">Affordability</h3>
            <p>Enjoy competitive rates with our budget-friendly ships solutions.</p>
          </div>
        </div>

        <button className="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded hover:bg-blue-700 transition">
          Get Started Now
        </button>

        <div className="mt-12 text-gray-500">
          <p>"Over 1,000 packages shipped daily!"</p>
          <p>"95% of packages delivered on time!"</p>
        </div>
      </div>
    </section>
  );
};

export default ReadyToShip;