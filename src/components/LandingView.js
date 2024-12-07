import React, { useEffect, useRef } from "react";
import landingBackground from '../assets/landing-background.png';

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
    <section ref={ref}
      className="flex flex-col items-center justify-center h-screen text-center relative animate__animated animate__fadeIn"
      style={{
        backgroundImage: `url(${landingBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
        <h1 className="text-5xl font-bold mb-4 animate__animated animate__fadeInDown animate__delay-1s">
          Welcome to Icarus Ships
        </h1>
        <p className="text-lg mb-8 animate__animated animate__fadeInLeft animate__delay-1.5s">
          Your gateway to swift and reliable ships solutions.
        </p>

        {/* Button with Hover and Click Effects */}
        <button 
          className="bg-dark-orange text-white px-6 py-2 rounded transition-transform transform hover:scale-105"
          onMouseDown={(e) => {
            e.currentTarget.classList.add('animate__animated', 'animate__rubberBand');
          }}
          onAnimationEnd={(e) => {
            e.currentTarget.classList.remove('animate__animated', 'animate__rubberBand');
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default LandingView;