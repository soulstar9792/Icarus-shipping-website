// src/components/Navbar.js
import React, { useState } from 'react';
import { useSectionContext } from '../context/SectionContext';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { FaBars, FaTimes } from 'react-icons/fa';
import 'animate.css';

const Navbar = () => {
  const { refs } = useSectionContext();
  const location = useLocation(); // Get the current route
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="flex justify-between items-center bg-transparent text-white p-4 fixed w-full z-20 animate__animated animate__fadeInDown">
      <Link to="/" className="flex items-center" onClick={scrollToTop}>
        <img src={logo} alt="Icarus Ships Logo" className="h-10 mr-2" />
        <h1 className="text-xl text-light-gray">Icarus Ships</h1> {/* Improved logo text color */}
      </Link>

      <div className="md:hidden cursor-pointer" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">
        {/* Conditionally render these buttons based on the current page */}
        {location.pathname === '/' && (
          <>
            <button className="text-light-gray hover:text-dark-orange transition" onClick={() => scrollToSection(refs.howItWorksRef)}>How It Works</button>
            <button className="text-light-gray hover:text-dark-orange transition" onClick={() => scrollToSection(refs.clearPricingRef)}>Pricing</button>
            <button className="text-light-gray hover:text-dark-orange transition" onClick={() => scrollToSection(refs.faqRef)}>FAQ</button>
          </>
        )}
        
        <Link to="/login" className="text-light-gray hover:text-dark-orange transition">Login</Link>
        <Link to="/register" className="text-light-gray hover:text-dark-orange transition">Register</Link>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`absolute top-16 left-0 right-0 bg-black bg-opacity-90 transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 h-auto' : 'opacity-0 h-0 pointer-events-none'
        }`}>
        <div className="flex flex-col items-center py-4">
          {/* Conditionally render these buttons based on the current page */}
          {location.pathname === '/' && (
            <>
              <button className="w-full text-center p-4 text-light-gray hover:text-dark-orange transition" onClick={() => { scrollToSection(refs.howItWorksRef); setMobileMenuOpen(false); }}>How It Works</button>
              <button className="w-full text-center p-4 text-light-gray hover:text-dark-orange transition" onClick={() => { scrollToSection(refs.clearPricingRef); setMobileMenuOpen(false); }}>Pricing</button>
              <button className="w-full text-center p-4 text-light-gray hover:text-dark-orange transition" onClick={() => { scrollToSection(refs.faqRef); setMobileMenuOpen(false); }}>FAQ</button>
            </>
          )}
          <Link to="/login" className="w-full text-center p-4 text-light-gray hover:text-dark-orange transition" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          <Link to="/register" className="w-full text-center p-4 text-light-gray hover:text-dark-orange transition" onClick={() => setMobileMenuOpen(false)}>Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;