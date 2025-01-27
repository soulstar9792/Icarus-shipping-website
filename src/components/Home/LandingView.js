import React, { useEffect, useRef } from "react";
import sapphireLanding from "../../assets/sapphireLanding.webp";
import "./LandingView.css";
import { useNavigate } from "react-router-dom";

const LandingView = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__fadeIn");
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
    <section
      ref={ref}
      className="landing-view flex flex-col items-center justify-center h-screen text-center relative"
      style={{
        backgroundImage: `url(${sapphireLanding})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
      }}
    >
      <div className="overlay absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute top-[35%] left-[50%] translate-x-[-50%] z-10">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold lg:text-5xl text-primary animate__animated animate__zoomIn animate__delay-1s" style={{
          textShadow: "4px 4px 3px darkblue"
        }}>
          Welcome to Sapphire Labels!
        </h1>
        <p className="text-xs md:text-sm lg:text-lg mt-4 text-secondary animate__animated animate__fadeInUp animate__delay-1.5s">
          Your gateway to swift and reliable shipping solutions.
        </p>
        <button
          aria-label="Get Started"
          className="btn-start text-white text-sm px-6 py-2 rounded border-2 border-dark-orange transition-all duration-300"
          onMouseDown={(e) => {
            e.currentTarget.classList.add(
              "animate__animated",
              "animate__wobble"
            );
          }}
          onAnimationEnd={(e) => {
            e.currentTarget.classList.remove(
              "animate__animated",
              "animate__wobble"
            );
            navigate('/register');
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default LandingView;
