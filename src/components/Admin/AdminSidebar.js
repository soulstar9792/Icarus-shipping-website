import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUserCog, FaTag, FaUser } from 'react-icons/fa';
import { BsCurrencyDollar } from "react-icons/bs";
import $GS from '../../styles/constants'; // Import styles
import logo from '../../assets/logo.png';  // Update the path to your logo

const adminMenuItems = [
  {
    path: '/main/dashboard',
    icon: <FaUser className="mr-2" />,
    label: 'User Panel',
  },
  {
    path: '/admin/dashboard',
    icon: <FaTachometerAlt className="mr-2" />,
    label: 'Dashboard',
  },
  {
    path: '/admin/user-management',
    icon: <FaUserCog className="mr-2" />,
    label: 'User Management',
  },
  {
    path: '/admin/order-label-management',
    icon: <FaTag className="mr-2" />,
    label: 'Order Label Management',
  },
  {
    path: '/admin/service-prices',
    icon: <BsCurrencyDollar className="mr-2" />,
    label: 'Service Prices ',
  },
];

const AdminSidebar = ({isSidebarOpen, toggleSidebar}) => {
  const location = useLocation(); // Get the current location

  return (
    <div  className={` lg:block lg:w-fit lg:relative ${isSidebarOpen ? 'block fixed bg-black h-screen bg-opacity-50 top-0 left-0 z-50 w-screen' : 'hidden'}`} onClick={toggleSidebar}>
      <div className={`${isSidebarOpen ? 'block top-0 left-0 z-50' : 'hidden'} lg:block w-[250px] bg-custom-background border-thin border-custom-border text-white h-full p-0 ${$GS.cardContainer}`}>
        {/* Logo Section */}
        <Link to="/main/dashboard" className={`${$GS.textHeading_2} mt-10 flex justify-center items-center`}>
          <img src={logo} alt="Icarus Ships Logo" className="h-10 mr-2" />
          <h1 className={`text-xl transition-colors duration-300`}>Icarus Admin</h1>
        </Link>
        <ul className="w-full">
          {adminMenuItems.map((item, index) => {
            // Check if the current item's path matches the current location
            const isActive = location.pathname === item.path;
            return (
              <li className={`${$GS.Box_1} ${isActive ? $GS.ActiveBox : ''}`} key={index}>
                <Link className={`${$GS.SidebarItem}`} to={item.path}>
                  <span className={`${isActive ? $GS.hoverText : ''} flex items-center`}>
                    {item.icon} {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

    </div>
  );
}

export default AdminSidebar;