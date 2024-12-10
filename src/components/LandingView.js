import React, { useEffect, useRef } from "react";
import landingBackground from '../assets/landing-background.png';
import './LandingView.css'; // Ensure you've created this file

const LandingView = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeIn');
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
    <section ref={ref} className="landing-view flex flex-col items-center justify-center h-screen text-center relative" style={{
      backgroundImage: `url(${landingBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="overlay absolute inset-0 bg-black opacity-50"></div> {/* Added overlay for improved visibility */}
      <div className="relative z-10 p-4 md:p-8 lg:p-12"> {/* Adjusted padding for responsiveness */}
        {/* Animated heading */}
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold mb-4 text-primary animate__animated animate__zoomIn animate__delay-1s">
          Welcome to Icarus Ships
        </h1>
        {/* Animated paragraph */}
        <p className="text-lg md:text-2xl lg:text-3xl mb-8 text-secondary animate__animated animate__fadeInUp animate__delay-1.5s">
          Your gateway to swift and reliable ship solutions.
        </p>
        {/* Animated button with initial border color */}
        <button
          className="btn-start text-white text-lg md:text-xl px-6 py-2 rounded border-2 border-dark-orange transition-all duration-300 " 
          onMouseDown={(e) => {
            e.currentTarget.classList.add('animate__animated', 'animate__wobble');
          }} 
          onAnimationEnd={(e) => {
            e.currentTarget.classList.remove('animate__animated', 'animate__wobble');
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default LandingView;