// src/pages/Main.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../components/Main/Dashboard';
import OrderLabel from '../components/Main/OrderLabel';
import BulkOrder from '../components/Main/BulkOrder';
import Orders from '../components/Main/Orders';
import BatchOrders from '../components/Main/BatchOrders';
import Deposit from '../components/Main/Deposit';
import Address from '../components/Main/Address';
import AdminPanel from '../components/Main/AdminPanel';
import Sidebar from '../components/Main/Sidebar'; // Import Sidebar
import MainHeader from '../components/Main/MainHeader'; // Import MainHeader

const routes = [
  { path: 'dashboard', Component: Dashboard },
  { path: 'order-label', Component: OrderLabel },
  { path: 'bulk-order', Component: BulkOrder },
  { path: 'orders', Component: Orders },
  { path: 'batch-orders', Component: BatchOrders },
  { path: 'deposit', Component: Deposit },
  { path: 'address', Component: Address },
  { path: 'admin', Component: AdminPanel }
];

const Main = () => {
  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Static Sidebar on the left */}
      <div className="flex flex-col w-full">
        <MainHeader /> {/* Main Header at the top */}
        <div className="flex-1 overflow-auto p-4">
          <Routes>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={<PrivateRoute><route.Component /></PrivateRoute>}
              />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Main;