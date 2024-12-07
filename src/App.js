// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'animate.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrderLabel from './pages/OrderLabel';
import BulkOrder from './pages/BulkOrder';
import Orders from './pages/Orders';
import BatchOrders from './pages/BatchOrders';
import Deposit from './pages/Deposit';
import Address from './pages/Address';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import { SectionProvider } from './context/SectionContext'; // Import the SectionProvider

function App() {
  return (
    <Router>
      <SectionProvider> {/* Wrap your application here */}
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/order-label" element={<OrderLabel />} />
            <Route path="/bulk-order" element={<BulkOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/batch-orders" element={<BatchOrders />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/address" element={<Address />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </SectionProvider>
    </Router>
  );
}

export default App;