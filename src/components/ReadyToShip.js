import React, { useEffect, useRef, useState } from "react";
import { FaShippingFast, FaBox } from "react-icons/fa";
import shipImage from '../assets/ship.jpg'; // Replace with your image path
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
      className="py-20 bg-cover bg-center relative text-white"
      style={{ backgroundImage: `url(${shipImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className={`relative container mx-auto px-4 text-center animate__delay-1s ${isVisible ? 'animate__animated animate__fadeInUp' : 'opacity-0'}`}>
        <h2 className="text-5xl font-bold mb-4">Ready to Ship Your Goods?</h2>
        <p className="text-xl mb-8">Experience fast, reliable shipping at unbeatable prices. It's time to get your products moving!</p>
        <div className="flex justify-center mb-10">
          <div className="flex flex-col items-center mx-4">
            <FaShippingFast className="text-6xl mb-2" />
            <p className="text-lg">Fast Delivery</p>
          </div>
          <div className="flex flex-col items-center mx-4">
            <FaBox className="text-6xl mb-2" />
            <p className="text-lg">Multiple Options</p>
          </div>
        </div>
        <a href="#" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg transition ease-in-out duration-200">
          Start Shipping Today
        </a>
      </div>
    </section>
  );
};

export default ReadyToShip;