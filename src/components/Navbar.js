import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ensure this path points correctly to your logo

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-transparent text-white p-4 fixed w-full z-10">
      <div className="flex items-center">
        <img src={logo} alt="Icarus Shipping Logo" className="h-10 mr-2" />
        <h1 className="text-xl">Icarus Shipping</h1>
      </div>
      <div>
        <Link className="mr-6 hover:text-dark-orange transition" to="/">Home</Link>
        <Link className="mr-6 hover:text-dark-orange transition" to="/login">Login</Link>
        <Link className="hover:text-dark-orange transition" to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;