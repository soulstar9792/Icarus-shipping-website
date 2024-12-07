import React, { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaRegHandshake, FaEye, FaThumbsUp } from "react-icons/fa";

const HowItWorks = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return (
    <section ref={ref} className="py-10 md:py-20 px-4 md:px-10 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
      <h2 className={`text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-white ${isVisible ? 'animate__animated animate__fadeInDown' : ''}`}>
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Step 1: Sign Up */}
        <div className={`rounded-lg p-6 md:p-8 border-2 border-purple-500 shadow-lg transition-transform duration-300 bg-gradient-to-br from-purple-200 to-purple-500 hover:scale-105 hover:shadow-2xl ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
          <div className="flex items-center mb-3 md:mb-4">
            <FaCheckCircle className="text-4xl md:text-5xl text-purple-900 mr-2 md:mr-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Sign Up</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-4">Create an account in minutes and access our range of services effortlessly.</p>
        </div>

        {/* Step 2: Choose Service */}
        <div className={`rounded-lg p-6 md:p-8 border-2 border-green-500 shadow-lg transition-transform duration-300 bg-gradient-to-br from-green-200 to-green-500 hover:scale-105 hover:shadow-2xl ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
          <div className="flex items-center mb-3 md:mb-4">
            <FaRegHandshake className="text-4xl md:text-5xl text-green-900 mr-2 md:mr-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Choose a Service</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-4">Browse our services and select the one that fits your needs the best.</p>
        </div>

        {/* Step 3: Confirmation */}
        <div className={`rounded-lg p-6 md:p-8 border-2 border-yellow-500 shadow-lg transition-transform duration-300 bg-gradient-to-br from-yellow-200 to-yellow-500 hover:scale-105 hover:shadow-2xl ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
          <div className="flex items-center mb-3 md:mb-4">
            <FaEye className="text-4xl md:text-5xl text-yellow-900 mr-2 md:mr-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Confirmation</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-4">Confirm your choice, and we'll process your request without delay.</p>
        </div>

        {/* Step 4: Enjoy Your Service */}
        <div className={`rounded-lg p-6 md:p-8 border-2 border-blue-500 shadow-lg transition-transform duration-300 bg-gradient-to-br from-blue-200 to-blue-500 hover:scale-105 hover:shadow-2xl ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
          <div className="flex items-center mb-3 md:mb-4">
            <FaThumbsUp className="text-4xl md:text-5xl text-blue-900 mr-2 md:mr-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Enjoy Your Service</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-4">Experience our top-notch service and enjoy the benefits it brings!</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;