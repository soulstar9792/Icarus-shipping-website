// src/components/Main/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTag,
  FaShoppingCart,
  FaClipboardList,
  FaBoxes,
  FaDollarSign,
  FaAddressCard,
  FaUserShield,
} from "react-icons/fa"; // Importing FaDollarSign
import $GS from "../../styles/constants"; // Import styles
import Sapphirelogo from "../../assets/Sapphirelogo.jpg"; // Update this path to where your logo is stored
import { useSelector } from "react-redux";
import { MdFindInPage } from "react-icons/md";

const menuItems = [
  {
    path: "/main/dashboard",
    icon: <FaTachometerAlt className="mr-2" />,
    label: "Dashboard",
  },
  {
    path: "/main/order-label",
    icon: <FaTag className="mr-2" />,
    label: "Order Label",
  },
  {
    path: "/main/bulk-order",
    icon: <FaShoppingCart className="mr-2" />,
    label: "Bulk Order",
  },
  {
    path: "/main/orders",
    icon: <FaClipboardList className="mr-2" />,
    label: "Orders",
  },
  {
    path: "/main/batch-orders",
    icon: <FaBoxes className="mr-2" />,
    label: "Batch Orders",
  },
  // {
  //   path: "/main/deposit",
  //   icon: <FaDollarSign className="mr-2" />, // Using FaDollarSign as the new deposit icon
  //   label: "Deposit",
  // },
  {
    path: "/main/address",
    icon: <FaAddressCard className="mr-2" />,
    label: "Address",
  },
  {
    path: "/main/sku",
    icon: <MdFindInPage className="mr-2" />,
    label: "SKU Management",
  },
  {
    path: "/admin/dashboard",
    icon: <FaUserShield className="mr-2" />,
    label: "Admin Panel",
  },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  setTimeout(() => {}, 1000);

  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  return (
    <div
      className={` lg:block lg:w-fit lg:relative ${
        isSidebarOpen
          ? "block fixed bg-black h-screen bg-opacity-50 top-0 left-0 z-50 w-screen"
          : "hidden"
      }`}
      onClick={toggleSidebar}
    >
      <div
        className={`${
          isSidebarOpen ? "block top-0 left-0 z-50" : "hidden"
        } lg:block w-[200px] bg-custom-background border-thin border-custom-border text-white h-full p-0 ${
          $GS.cardContainer
        } `}
      >
        {/* Logo Section */}
        <Link
          to="/main/dashboard"
          className={`${$GS.textHeading_2} mt-10 flex justify-center mx-auto items-center`}
        >
          <img src={Sapphirelogo} alt="Sapphire Labels Logo" className="h-10 " />
          <h1 className={`text-xl tracking-tighter truncate transition-colors mr-2 duration-300`}>
            Sapphire Labels
          </h1>
        </Link>
        <ul className="w-full">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                className={`${$GS.Box_1} ${isActive ? $GS.ActiveBox : ""}`}
                key={index}
              >
                {index !== 7 && (
                  <Link className={`${$GS.SidebarItem}`} to={item.path}>
                    <span
                      className={`${
                        isActive ? $GS.hoverText : ""
                      } flex items-center`}
                    >
                      {item.icon} {item.label}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
          {user.user_role === "admin" && (
            <li className={`${$GS.Box_1} `} key={8}>
              <Link className={`${$GS.SidebarItem}`} to={menuItems[7].path}>
                <span className={`${$GS.hoverText} flex items-center`}>
                  {menuItems[7].icon} {menuItems[7].label}
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
