// src/components/Main/MainHeader.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import hooks from react-redux
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { logout } from './../../redux/authSlice'; // Import logout action from authSlice
import avatar from '../../assets/avatar-empty.png';
import hamburger from '../../assets/hamburger.svg';

const MainHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const dispatch = useDispatch(); // Create dispatch for Redux
  const currentUser = useSelector((state) => state.auth.user); // Get user from Redux store
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate('/login'); // Redirect to the login page
  };

  // Map routes to display the appropriate title
  const routeTitles = {
    '/main/dashboard': 'Dashboard',
    '/main/order-label': 'Order Label',
    '/main/bulk-order': 'Bulk Order',
    '/main/orders': 'Orders',
    '/main/batch-orders': 'Batch Orders',
    '/main/deposit': 'Deposit',
    '/main/address': 'Address',
    '/main/admin': 'Admin Panel',
    '/main/account': 'Manage Account', // Add account route title
  };

  const currentTitle = routeTitles[location.pathname] || 'Welcome';

  return (
    <div className="bg-custom-background text-white p-4 border-b border-custom-border flex justify-between items-center">
      <button className="lg:hidden flex items-center focus:outline-none" onClick={toggleSidebar}>
        <img src={hamburger} alt="Hamburger" className="w-[60px] h-[60px]" />
      </button>
      <h1 className="text-2xl font-semibold">{currentTitle}</h1>
      <div className="relative">
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center focus:outline-none">
          <img
            src={currentUser?.avatar || avatar} // Display user's avatar or default avatar
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-custom-border"
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg z-40 p-4 w-48">
            {/* User Info Section */}
            <div className="flex flex-col items-start mb-4">
              <img
                src={currentUser?.avatar || avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full mb-2"
              />
              <span className="font-semibold">{currentUser?.name || 'User Name'}</span>
              <span className="text-sm text-gray-500">{`Balance: $${currentUser?.balance || '0.00'}`}</span>
            </div>
            {/* Dropdown Links */}
            <Link to="/main/account" className="block px-4 py-2 hover:bg-gray-100">
              Account
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainHeader;