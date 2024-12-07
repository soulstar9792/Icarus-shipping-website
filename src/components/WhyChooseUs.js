import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="py-20 px-10 bg-gray-900">
      <h2 className="text-4xl text-center mb-8 animate__animated animate__fadeInDown">
        Why Choose Us
      </h2>
      <div className="flex flex-col md:flex-row justify-around items-baseline space-y-8 md:space-y-0 md:space-x-8">
        {/* Feature 1 */}
        <div
          className="flex flex-col items-center bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 transition duration-300 animate__animated animate__zoomIn"
          style={{ animationDelay: '0.5s' }} // Animation delay for Feature 1
        >
          <div className="text-6xl mb-4" aria-label="Quality Service Icon">⭐</div>
          <h3 className="text-xl font-bold mb-2">Quality Service</h3>
          <p className="text-center">We ensure top-notch service for all your ships needs.</p>
        </div>

        {/* Feature 2 */}
        <div
          className="flex flex-col items-center bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 transition duration-300 animate__animated animate__swing"
          style={{ animationDelay: '1s' }} // Animation delay for Feature 2
        >
          <div className="text-6xl mb-4" aria-label="Affordable Rates Icon">💵</div>
          <h3 className="text-xl font-bold mb-2">Affordable Rates</h3>
          <p className="text-center">We offer competitive pricing without compromising quality.</p>
        </div>

        {/* Feature 3 */}
        <div
          className="flex flex-col items-center bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 transition duration-300 animate__animated animate__bounceIn"
          style={{ animationDelay: '1.5s' }} // Animation delay for Feature 3
        >
          <div className="text-6xl mb-4" aria-label="Customer Support Icon">📞</div>
          <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
          <p className="text-center">Our team is here to assist you anytime you need help.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;