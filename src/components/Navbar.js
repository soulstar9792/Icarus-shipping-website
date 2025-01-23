import React, { useState } from "react";
import { useSectionContext } from "../context/SectionContext";
import { Link, useLocation } from "react-router-dom";
import Sapphirelogo from "../assets/logo_1.webp";
import { FaBars, FaTimes } from "react-icons/fa";
import "animate.css";

const Navbar = () => {
  const { refs } = useSectionContext();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`flex justify-between items-center p-4 fixed w-full z-20 animate__animated animate__fadeInDown bg-custom-background shadow-lg border-b border-blue-900`}
    >
      <Link to="/" className="flex items-center" onClick={scrollToTop}>
        <img src={Sapphirelogo} alt="Sapphire Labels Logo" className="h-10 mr-2" />
        <h1 className={`text-xl transition-colors duration-300 text-sapphire hover:text-sapphire-hover`}>
          Sapphire Labels
        </h1>
      </Link>

      <div
        className="md:hidden cursor-pointer  text-sapphire hover:text-sapphire-hover"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex">
        {location.pathname === "/" && (
          <>
            <button
              className={` text-sapphire hover:text-sapphire-hover inline-flex items-center justify-center border border-transparent hover:border-sapphire-hover hover:shadow-lg h-full transition px-4`}
              onClick={() => scrollToSection(refs.howItWorksRef)}
            >
              How It Works
            </button>
            <button
              className={` text-sapphire hover:text-sapphire-hover inline-flex items-center justify-center border border-transparent hover:border-sapphire-hover hover:shadow-lg h-full transition px-4`}
              onClick={() => scrollToSection(refs.clearPricingRef)}
            >
              Pricing
            </button>
            <button
              className={` text-sapphire hover:text-sapphire-hover inline-flex items-center justify-center border border-transparent hover:border-sapphire-hover hover:shadow-lg h-full transition px-4`}
              onClick={() => scrollToSection(refs.faqRef)}
            >
              FAQ
            </button>
          </>
        )}

        <Link
          to="/login"
          className={` text-sapphire hover:text-sapphire-hover inline-flex items-center justify-center border border-transparent hover:border-sapphire-hover hover:shadow-lg h-full transition px-4`}
        >
          Login
        </Link>
        <Link
          to="/register"
          className={` text-sapphire hover:text-sapphire-hover inline-flex items-center justify-center border border-transparent hover:border-sapphire-hover hover:shadow-lg h-full transition px-4`}
        >
          Register
        </Link>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 left-0 right-0 bg-black bg-opacity-90 transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 h-auto"
            : "opacity-0 h-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center py-4">
          {location.pathname === "/" && (
            <>
              <button
                className={`w-full text-center p-4  text-sapphire hover:text-sapphire-hover hover:bg-hover-background transition`}
                onClick={() => {
                  scrollToSection(refs.howItWorksRef);
                  setMobileMenuOpen(false);
                }}
              >
                How It Works
              </button>
              <button
                className={`w-full text-center p-4  text-sapphire hover:text-sapphire-hover hover:bg-hover-background transition`}
                onClick={() => {
                  scrollToSection(refs.clearPricingRef);
                  setMobileMenuOpen(false);
                }}
              >
                Pricing
              </button>
              <button
                className={`w-full text-center p-4  text-sapphire hover:text-sapphire-hover hover:bg-hover-background transition`}
                onClick={() => {
                  scrollToSection(refs.faqRef);
                  setMobileMenuOpen(false);
                }}
              >
                FAQ
              </button>
            </>
          )}
          <Link
            to="/login"
            className="w-full text-center p-4  text-sapphire hover:text-sapphire-hover hover:bg-hover-background transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="w-full text-center p-4  text-sapphire hover:text-sapphire-hover hover:bg-hover-background transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
