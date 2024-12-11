// src/components/Main/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-1/4 bg-gray-800 text-white h-full p-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul>
        <li className="mb-2"><Link to="/main/dashboard">Dashboard</Link></li>
        <li className="mb-2"><Link to="/main/order-label">Order Label</Link></li>
        <li className="mb-2"><Link to="/main/bulk-order">Bulk Order</Link></li>
        <li className="mb-2"><Link to="/main/orders">Orders</Link></li>
        <li className="mb-2"><Link to="/main/batch-orders">Batch Orders</Link></li>
        <li className="mb-2"><Link to="/main/deposit">Deposit</Link></li>
        <li className="mb-2"><Link to="/main/address">Address</Link></li>
        <li className="mb-2"><Link to="/main/admin">Admin Panel</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;