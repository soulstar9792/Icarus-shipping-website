// src/components/Main/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaTag, FaShoppingCart, FaClipboardList, FaBoxes, FaDollarSign, FaAddressCard, FaUserShield } from 'react-icons/fa'; // Importing FaDollarSign
import $GS from '../../styles/constants'; // Import styles
import logo from '../../assets/logo.png';  // Update this path to where your logo is stored
import { useSelector } from 'react-redux';

const menuItems = [
  {
    path: '/main/dashboard',
    icon: <FaTachometerAlt className="mr-2" />,
    label: 'Dashboard',
  },
  {
    path: '/main/order-label',
    icon: <FaTag className="mr-2" />,
    label: 'Order Label',
  },
  {
    path: '/main/bulk-order',
    icon: <FaShoppingCart className="mr-2" />,
    label: 'Bulk Order',
  },
  {
    path: '/main/orders',
    icon: <FaClipboardList className="mr-2" />,
    label: 'Orders',
  },
  {
    path: '/main/batch-orders',
    icon: <FaBoxes className="mr-2" />,
    label: 'Batch Orders',
  },
  {
    path: '/main/deposit',
    icon: <FaDollarSign className="mr-2" />, // Using FaDollarSign as the new deposit icon
    label: 'Deposit',
  },
  {
    path: '/main/address',
    icon: <FaAddressCard className="mr-2" />,
    label: 'Address',
  },
  {
    path: '/admin',
    icon: <FaUserShield className="mr-2" />,
    label: 'Admin Panel',
  },
];

const Sidebar = () => {
  setTimeout(() => {
  }, 1000);

  const location = useLocation();
  const user = useSelector(state => state.auth.user);
  console.log(useSelector(state => state));

  return (
    <div className={`w-[250px] bg-custom-background border-thin border-custom-border text-white h-full p-0 ${$GS.cardContainer}`}>
      {/* Logo Section */}
      <Link to="/main/dashboard" className={`${$GS.textHeading_2} mt-10 flex items-center`} >
        <img src={logo} alt="Icarus Ships Logo" className="h-10 mr-2" />
        <h1 className={`text-xl transition-colors duration-300`}>Icarus Ships</h1>
      </Link>
      <ul className="w-full">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <li className={`${$GS.Box_1} ${isActive ? $GS.ActiveBox : ''}`} key={index}>
              {index !== 7 && <Link className={`${$GS.SidebarItem}`} to={item.path}>
                <span className={`${isActive ? $GS.hoverText : ''} flex items-center`}>
                  {item.icon} {item.label}
                </span>
              </Link>}
            </li>
          );
        })}
        {user.user_role === 'admin' &&
          <li className={`${$GS.Box_1} `} key={8}>
            <Link className={`${$GS.SidebarItem}`} to={menuItems[7].path}>
              <span className={`${$GS.hoverText} flex items-center`}>
                {menuItems[7].icon} {menuItems[7].label}
              </span>
            </Link>
          </li>}
      </ul>
    </div>
  );
}

export default Sidebar;