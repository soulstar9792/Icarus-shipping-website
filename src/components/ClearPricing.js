import React, { useRef, useEffect, useState } from "react";
import { FaDollarSign, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const ClearPricing = () => {
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
    <section ref={ref} className="py-10 md:py-20 px-4 md:px-10 bg-gradient-to-r from-blue-600 to-teal-500 relative overflow-hidden">
      <h2 className={`text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-white ${isVisible ? 'animate__animated animate__fadeInDown' : ''}`}>
        Clear Pricing, No Hidden Fees
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Pricing Card 1 */}
        <div className={`rounded-lg p-6 md:p-8 border-2 border-blue-500 shadow-lg transition-transform duration-300 bg-gradient-to-br from-blue-200 to-blue-400 hover:scale-105 hover:shadow-2xl hover:transform hover:translate-y-[-10px] hover:border-blue-700 hover:bg-blue-300 ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
          <div className="flex items-center mb-3 md:mb-4">
            <FaDollarSign className="text-4xl md:text-5xl text-blue-900 mr-2 md:mr-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Transparent Pricing</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-4">No complex pricing structures—just clear and simple pricing that you can understand.</p>
        </div>

        {/* Pricing Card 2 */}
        <div className={`rounded-lg p-6 md:p-8 border-2 border-green-500 shadow-lg transition-transform duration-300 bg-gradient-to-br from-green-200 to-green-400 hover:scale-105 hover:shadow-2xl hover:transform hover:translate-y-[-10px] hover:border-green-700 hover:bg-green-300 ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
          <div className="flex items-center mb-3 md:mb-4">
            <FaCheckCircle className="text-4xl md:text-5xl text-green-900 mr-2 md:mr-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">No Hidden Fees</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-4">The price you see is the price you pay. No surprise fees at checkout!</p>
        </div>

        {/* Pricing Card 3 */}
        <div className={`rounded-lg p-6 md:p-8 border-2 border-yellow-500 shadow-lg transition-transform duration-300 bg-gradient-to-br from-yellow-200 to-yellow-400 hover:scale-105 hover:shadow-2xl hover:transform hover:translate-y-[-10px] hover:border-yellow-700 hover:bg-yellow-300 ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
          <div className="flex items-center mb-3 md:mb-4">
            <FaExclamationCircle className="text-4xl md:text-5xl text-yellow-900 mr-2 md:mr-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Complete Clarity</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-4">Enjoy complete transparency in all our services and offerings.</p>
        </div>
      </div>

      {/* Pricing Information Section */}
      <div className="mt-12">
        <h3 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${isVisible ? 'animate__animated animate__fadeInDown animate__delay-0-5s' : ''}`}>
          Service Pricing
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* USPS and UPS International in same column */}
          <div className="grid grid-cols-1 gap-6">
            {/* USPS Pricing */}
            <div className={`rounded-lg p-6 shadow-lg bg-gradient-to-br from-blue-100 to-blue-300 transition duration-300 hover:scale-105 ${isVisible ? 'animate__animated animate__slideInLeft animate__delay-1s' : ''}`}>
              <h4 className="text-2xl font-semibold text-gray-800 mb-2">USPS</h4>
              <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base">
                <li>Express: <strong>$3</strong> onwards</li>
                <li>Priority: <strong>$3</strong> onwards</li>
                <li>Ground Advantage: <strong>$3</strong> onwards</li>
              </ul>
            </div>

            {/* UPS International Pricing */}
            <div className={`rounded-lg p-6 shadow-lg bg-gradient-to-br from-yellow-100 to-yellow-300 transition duration-300 hover:scale-105 ${isVisible ? 'animate__animated animate__slideInLeft animate__delay-1s' : ''}`}>
              <h4 className="text-2xl font-semibold text-gray-800 mb-2">UPS International</h4>
              <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base">
                <li>Express Early: <strong>$9</strong> onwards</li>
                <li>Express: <strong>$8</strong> onwards</li>
                <li>Express Saver: <strong>$7</strong> onwards</li>
                <li>Expedited: <strong>$6</strong> onwards</li>
                <li>Standard: <strong>$5</strong> onwards</li>
              </ul>
            </div>
          </div>

          {/* UPS USA Pricing in own column */}
          <div className={`rounded-lg p-6 shadow-lg bg-gradient-to-br from-green-100 to-green-300 transition duration-300 hover:scale-105 ${isVisible ? 'animate__animated animate__slideInRight animate__delay-1s' : ''}`}>
            <h4 className="text-2xl font-semibold text-gray-800 mb-2">UPS USA</h4>
            <h5 className="font-bold text-gray-800">Next Day Services:</h5>
            <ul className="list-disc pl-5 mb-2 text-gray-700 text-sm md:text-base">
              <li>Next Day Air Early v2: <strong>$8</strong> onwards</li>
              <li>Next Day Air v2: <strong>$7</strong> onwards</li>
            </ul>
            <h5 className="font-bold text-gray-800">2nd Day Services:</h5>
            <ul className="list-disc pl-5 mb-2 text-gray-700 text-sm md:text-base">
              <li>2nd Day Air v2: <strong>$7</strong> onwards</li>
              <li>3 Day Select v2: <strong>$5</strong> onwards</li>
              <li>Ground v2: <strong>$4</strong> onwards</li>
            </ul>
            <h5 className="font-bold text-gray-800">Manifested Services:</h5>
            <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base">
              <li>Next Day Air Manifested: <strong>$12</strong> onwards</li>
              <li>2nd Day Air Manifested: <strong>$7</strong> onwards</li>
              <li>3 Day Select Manifested: <strong>$5</strong> onwards</li>
              <li>Ground Manifested: <strong>$4</strong> onwards</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClearPricing;