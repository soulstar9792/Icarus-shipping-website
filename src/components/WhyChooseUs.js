import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaDollarSign, FaPhone } from "react-icons/fa";

const WhyChooseUs = () => {
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
      <h2 className={`text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-white ${isVisible ? 'animate__animated animate__fadeInDown' : ''}`} 
          style={{ 
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)', 
            letterSpacing: '1px',
          }}>
        Why Choose Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
        {/* Feature 1: Quality Service */}
        <div className={`flex flex-col items-center bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-lg p-6 md:p-8 shadow-xl transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:rotate-3 hover:translate-x-1 hover:-translate-y-2 ${isVisible ? 'animate__animated animate__fadeInUp ' : ''}`} 
             style={{ perspective: '1000px' }}>
          <FaStar className="text-5xl md:text-6xl text-yellow-800 mb-2 md:mb-4 z-10 transition-all duration-300 transform hover:scale-110" />
          <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 z-10">Unmatched Quality Service</h3>
          <p className="text-center text-gray-800 z-10 mb-2 text-sm md:text-base">Experience exceptional service that prioritizes your needs.</p>
          <ul className="text-gray-800 text-xs md:text-sm mt-4 z-10">
            <li className="my-2 flex items-center">
              <span className="text-yellow-600 mr-2">✔️</span> 
              <span>24/7 availability to meet your needs.</span>
            </li>
            <li className="my-2 flex items-center">
              <span className="text-yellow-600 mr-2">✔️</span> 
              <span>Rigorous quality checks for consistent excellence.</span>
            </li>
            <li className="my-2 flex items-center">
              <span className="text-yellow-600 mr-2">✔️</span> 
              <span>98% satisfaction guarantee for your peace of mind.</span>
            </li>
          </ul>
          <blockquote className="mt-4 italic text-gray-700 z-10 p-2 rounded-md bg-transparent border-l-4 border-yellow-600">“Their service exceeded my expectations!” - Happy Customer</blockquote>
        </div>

        {/* Feature 2: Affordable Rates */}
        <div className={`flex flex-col items-center bg-gradient-to-b from-green-300 to-green-500 rounded-lg p-6 md:p-8 shadow-xl transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:rotate-3 hover:translate-x-1 hover:-translate-y-2 ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-0-5s ' : ''}`} 
             style={{ perspective: '1000px' }}>
          <FaDollarSign className="text-5xl md:text-6xl text-green-800 mb-2 md:mb-4 z-10 transition-all duration-300 transform hover:scale-110" />
          <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 z-10">Transparent and Affordable Rates</h3>
          <p className="text-center text-gray-800 z-10 mb-2 text-sm md:text-base">Discover competitive pricing without hidden fees.</p>
          <ul className="text-gray-800 text-xs md:text-sm mt-4 z-10">
            <li className="my-2 flex items-center">
              <span className="text-green-600 mr-2">✔️</span> 
              <span>Clear, hassle-free pricing with no hidden charges.</span>
            </li>
            <li className="my-2 flex items-center">
              <span className="text-green-600 mr-2">✔️</span> 
              <span>Exclusive discounts for our loyal customers.</span>
            </li>
            <li className="my-2 flex items-center">
              <span className="text-green-600 mr-2">✔️</span> 
              <span>Exceptional value that fits your budget.</span>
            </li>
          </ul>
          <blockquote className="mt-4 italic text-gray-700 z-10 p-2 rounded-md bg-transparent border-l-4 border-green-600">“Incredible value for the price!” - Satisfied User</blockquote>
        </div>

        {/* Feature 3: 24/7 Support */}
        <div className={`flex flex-col items-center bg-gradient-to-b from-blue-300 to-blue-500 rounded-lg p-6 md:p-8 shadow-xl transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:rotate-3 hover:translate-x-1 hover:-translate-y-2 ${isVisible ? 'animate__animated animate__fadeInUp animate__delay-1s ' : ''}`} 
             style={{ perspective: '1000px' }}>
          <FaPhone className="text-5xl md:text-6xl text-blue-800 mb-2 md:mb-4 z-10 transition-all duration-300 transform hover:scale-110" />
          <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 z-10">24/7 Support at Your Fingertips</h3>
          <p className="text-center text-gray-800 z-10 mb-2 text-sm md:text-base">Our dedicated team is here to help whenever you need us.</p>
          <ul className="text-gray-800 text-xs md:text-sm mt-4 z-10">
            <li className="my-2 flex items-center">
              <span className="text-blue-600 mr-2">✔️</span> 
              <span>Multilingual support to cater to all customers.</span>
            </li>
            <li className="my-2 flex items-center">
              <span className="text-blue-600 mr-2">✔️</span> 
              <span>Swift response times for quick resolutions.</span>
            </li>
            <li className="my-2 flex items-center">
              <span className="text-blue-600 mr-2">✔️</span> 
              <span>Experts on standby ready to assist you.</span>
            </li>
          </ul>
          <blockquote className="mt-4 italic text-gray-700 z-10 p-2 rounded-md bg-transparent border-l-4 border-blue-600">“They provide unmatched customer service!” - Loyal Client</blockquote>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;