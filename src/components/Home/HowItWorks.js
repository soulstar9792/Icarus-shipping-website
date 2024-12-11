// src/components/HowItWorks.js
import React, { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaRegHandshake, FaEye, FaThumbsUp } from "react-icons/fa";
import Card from '../Utils/Card';

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
    <section ref={ref} className="py-10 md:py-20 px-4 md:px-10 bg-custom-background relative overflow-hidden">
      <h2 className={`text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-text-emphasizing relative cursor-pointer transition-all duration-300 
                      ${isVisible ? 'animate__animated animate__zoomIn' : ''} 
                      group hover:text-shadow`}
      >
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        
        {/* Card Elements with Card Component */}
        {[
          { icon: <FaCheckCircle />, title: "Sign Up", description: "Create an account in minutes and access our range of services effortlessly." },
          { icon: <FaRegHandshake />, title: "Choose a Service", description: "Browse our services and select the one that fits your needs the best." },
          { icon: <FaEye />, title: "Confirmation", description: "Confirm your choice, and we'll process your request without delay." },
          { icon: <FaThumbsUp />, title: "Enjoy Your Service", description: "Experience our top-notch service and enjoy the benefits it brings!" }
        ].map((item, index) => (
          <Card key={index}>
            <div className="flex items-center mb-3 md:mb-4">
              <span className={`text-4xl md:text-5xl text-custom-border mr-2 md:mr-4 group-hover:text-hover-text`}>{item.icon}</span>
              <h3 className={`text-xl md:text-2xl font-semibold text-text-normal group-hover:text-hover-text`}>{item.title}</h3>
            </div>
            <p className={`text-sm md:text-base text-text-normal mb-2 md:mb-4 group-hover:text-hover-text`}>{item.description}</p>
          </Card>
        ))}

      </div>
    </section>
  );
};

export default HowItWorks;