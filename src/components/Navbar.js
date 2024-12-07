import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ensure this path points correctly to your logo
import 'animate.css';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-transparent text-white p-4 fixed w-full z-10 animate__animated animate__fadeInDown">
      <div className="flex items-center">
        <img src={logo} alt="Icarus Ships Logo" className="h-10 mr-2" />
        <h1 className="text-xl">Icarus Ships</h1>
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