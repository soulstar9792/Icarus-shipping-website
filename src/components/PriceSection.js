import React from "react";
import { FaTruck, FaPlane, FaGlobe } from "react-icons/fa"; // import icons

const PriceSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-600 text-white">
      <h2 className="text-5xl text-center mb-12 font-bold animate__animated animate__fadeInDown">Clear Pricing, No Hidden Fees</h2>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* USPS Pricing Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
              <FaTruck className="text-4xl mr-2" />
              <h3 className="text-3xl font-semibold">USPS</h3>
            </div>
            <ul className="mb-4">
              <li className="mb-2">Express: <span className="font-bold text-xl">$3 onwards</span></li>
              <li className="mb-2">Priority: <span className="font-bold text-xl">$3 onwards</span></li>
              <li className="mb-2">Ground Advantage: <span className="font-bold text-xl">$3 onwards</span></li>
            </ul>
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-400 transition duration-200">Choose USPS</button>
          </div>

          {/* UPS USA Pricing Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
              <FaPlane className="text-4xl mr-2" />
              <h3 className="text-3xl font-semibold">UPS USA</h3>
            </div>
            <ul className="mb-4">
              <li className="mb-2">Next Day Air Early: <span className="font-bold text-xl">$8 onwards</span></li>
              <li className="mb-2">Next Day Air: <span className="font-bold text-xl">$7 onwards</span></li>
              <li className="mb-2">2nd Day Air: <span className="font-bold text-xl">$7 onwards</span></li>
              <li className="mb-2">3 Day Select: <span className="font-bold text-xl">$5 onwards</span></li>
              <li className="mb-2">Ground: <span className="font-bold text-xl">$4 onwards</span></li>
            </ul>
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-400 transition duration-200">Choose UPS USA</button>
          </div>

          {/* UPS International Pricing Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
              <FaGlobe className="text-4xl mr-2" />
              <h3 className="text-3xl font-semibold">UPS International</h3>
            </div>
            <ul className="mb-4">
              <li className="mb-2">Express Early: <span className="font-bold text-xl">$9 onwards</span></li>
              <li className="mb-2">Express: <span className="font-bold text-xl">$8 onwards</span></li>
              <li className="mb-2">Express Saver: <span className="font-bold text-xl">$7 onwards</span></li>
              <li className="mb-2">Expedited: <span className="font-bold text-xl">$6 onwards</span></li>
              <li className="mb-2">Standard: <span className="font-bold text-xl">$5 onwards</span></li>
            </ul>
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-400 transition duration-200">Choose UPS International</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceSection;