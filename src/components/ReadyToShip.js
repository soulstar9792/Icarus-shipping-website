import React, { useEffect, useRef, useState } from "react";
import { FaShippingFast, FaBox } from "react-icons/fa";
import 'animate.css';

const ReadyToShip = () => {
  const [isVisible, setIsVisible] = useState(false); // State to manage visibility
  const sectionRef = useRef(null); // Reference to the section

  // Intersection Observer to detect when the section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once it's visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is in view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 md:px-10 bg-custom-background relative overflow-hidden"
    >
      <div className={`container mx-auto text-center animate__delay-1s ${isVisible ? 'animate__animated animate__fadeInUp' : 'opacity-0'}`}>
        <h2 className="text-5xl font-bold mb-4 text-text-emphasizing hover:text-shadow">Ready to Ship Your Goods?</h2>
        <p className="text-xl mb-8 text-text-normal">Experience fast, reliable shipping at unbeatable prices. It's time to get your products moving!</p>
        <div className="flex justify-center mb-10">
          {/* Card Items for Shipping Features */}
          {[
            { icon: <FaShippingFast />, text: "Fast Delivery" },
            { icon: <FaBox />, text: "Multiple Options" }
          ].map((item, index) => (
            <div key={index} className="border-thin border-custom-border rounded-small p-6 bg-card-background transition-all duration-300 shadow-lg group hover:border-hover-border hover:shadow-bright mx-4">
              <div className="flex flex-col items-center">
                <span className={`text-6xl text-custom-border mb-2 group-hover:text-hover-text`}>{item.icon}</span>
                <p className={`text-lg text-text-normal group-hover:text-hover-text`}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="#" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg transition ease-in-out duration-200">
          Start Shipping Today
        </a>
      </div>
    </section>
  );
};

export default ReadyToShip;