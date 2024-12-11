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
    <section ref={ref} className="py-10 md:py-20 px-4 md:px-10 bg-custom-background relative overflow-hidden">
      <h2 className={`text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-text-emphasizing cursor-pointer transition-all duration-300 
                      ${isVisible ? 'animate__animated animate__fadeInDown' : ''} 
                      hover:shadow-lg hover:text-shadow`}>
        Clear Pricing, No Hidden Fees
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Pricing Card 1 */}
        <div className={`flex flex-col items-center bg-card-background rounded-small p-6 md:p-8 border border-custom-border shadow-lg transition-all duration-300 hover:shadow-bright hover:border-hover-border ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
          <FaDollarSign className="text-4xl md:text-5xl text-blue-600 mb-2 md:mb-4 z-10 transition-all duration-300 hover:text-blue-400" />
          <h3 className="text-xl md:text-2xl font-semibold text-text-normal mb-2 z-10 transition-all duration-300 hover:text-hover-text hover:text-shadow">Transparent Pricing</h3>
          <p className="text-sm md:text-base text-text-normal mb-2 md:mb-4 z-10">Enjoy straightforward pricing options designed to fit your budget.</p>
        </div>

        {/* Pricing Card 2 */}
        <div className={`flex flex-col items-center bg-card-background rounded-small p-6 md:p-8 border border-custom-border shadow-lg transition-all duration-300 hover:shadow-bright hover:border-hover-border ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
          <FaCheckCircle className="text-4xl md:text-5xl text-green-600 mb-2 md:mb-4 z-10 transition-all duration-300 hover:text-green-400" />
          <h3 className="text-xl md:text-2xl font-semibold text-text-normal mb-2 z-10 transition-all duration-300 hover:text-hover-text hover:text-shadow">No Hidden Fees</h3>
          <p className="text-sm md:text-base text-text-normal mb-2 md:mb-4 z-10">Rest assured, the price you see is the price you get, with no surprises.</p>
        </div>

        {/* Pricing Card 3 */}
        <div className={`flex flex-col items-center bg-card-background rounded-small p-6 md:p-8 border border-custom-border shadow-lg transition-all duration-300 hover:shadow-bright hover:border-hover-border ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
          <FaExclamationCircle className="text-4xl md:text-5xl text-yellow-600 mb-2 md:mb-4 z-10 transition-all duration-300 hover:text-yellow-400" />
          <h3 className="text-xl md:text-2xl font-semibold text-text-normal mb-2 z-10 transition-all duration-300 hover:text-hover-text hover:text-shadow">Complete Clarity</h3>
          <p className="text-sm md:text-base text-text-normal mb-2 md:mb-4 z-10">Our services are competitively priced with complete transparency.</p>
        </div>
      </div>

      {/* Pricing Information Section */}
      <div className="mt-12">
        <h3 className={`text-3xl md:text-4xl font-bold text-center mb-8 text-text-emphasizing ${isVisible ? 'animate__animated animate__fadeInDown animate__delay-0-5s' : ''} transition-all duration-300 hover:text-shadow hover:text-hover-text`}>
          Service Pricing
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* USPS and UPS International in same column */}
          <div className="grid grid-cols-1 gap-6">
            {/* USPS Pricing */}
            <div className={`rounded-small p-6 border border-custom-border bg-card-background transition-all duration-300 hover:shadow-bright hover:border-hover-border ${isVisible ? 'animate__animated animate__slideInLeft animate__delay-1s' : ''}`}>
              <h4 className="text-2xl font-semibold text-text-emphasizing mb-2">USPS</h4>
              <ul className="list-disc pl-5 text-text-normal text-sm md:text-base">
                <li>Express: <strong>Starting from affordable rates</strong></li>
                <li>Priority: <strong>Get competitive pricing options</strong></li>
                <li>Ground Advantage: <strong>Options that fit your needs</strong></li>
              </ul>
            </div>

            {/* UPS International Pricing */}
            <div className={`rounded-small p-6 border border-custom-border bg-card-background transition-all duration-300 hover:shadow-bright hover:border-hover-border ${isVisible ? 'animate__animated animate__slideInLeft animate__delay-1s' : ''}`}>
              <h4 className="text-2xl font-semibold text-text-emphasizing mb-2">UPS International</h4>
              <ul className="list-disc pl-5 text-text-normal text-sm md:text-base">
                <li>Options available for various needs</li>
                <li>Competitive pricing based on service type</li>
                <li>Choose from expedited to standard delivery</li>
              </ul>
            </div>
          </div>

          {/* UPS USA Pricing in own column */}
          <div className={`rounded-small p-6 border border-custom-border bg-card-background transition-all duration-300 hover:shadow-bright hover:border-hover-border ${isVisible ? 'animate__animated animate__slideInRight animate__delay-1s' : ''}`}>
            <h4 className="text-2xl font-semibold text-text-emphasizing mb-2">UPS USA</h4>
            <h5 className="font-bold text-text-emphasizing">Next Day Services:</h5>
            <ul className="list-disc pl-5 mb-2 text-text-normal text-sm md:text-base">
              <li>Options available, starting from competitive rates</li>
              <li>Check our flexible pricing options</li>
            </ul>
            <h5 className="font-bold text-text-emphasizing">2nd Day Services:</h5>
            <ul className="list-disc pl-5 mb-2 text-text-normal text-sm md:text-base">
              <li>Variety of services tailored to your needs</li>
              <li>Transparent pricing structure</li>
            </ul>
            <h5 className="font-bold text-text-emphasizing">Manifested Services:</h5>
            <ul className="list-disc pl-5 text-text-normal text-sm md:text-base">
              <li>Packages designed to offer flexibility</li>
              <li>Customize your shipping based on your requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClearPricing;