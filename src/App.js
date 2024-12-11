// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'animate.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main'; 
import Navbar from './components/Navbar';
import { SectionProvider } from './context/SectionContext'; 
import { AuthProvider } from './context/AuthContext'; 
import PrivateRoute from './components/PrivateRoute'; 

function App() {
  const location = useLocation();

  // Determine if the current route is public
  const isPublicRoute = () => {
    return location.pathname === '/' ||
           location.pathname === '/login' ||
           location.pathname === '/register';
  };

  return (
    <div className="App">
      {isPublicRoute() && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/main/*" element={<PrivateRoute><Main /></PrivateRoute>} /> {/* Note the /* */}
      </Routes>
    </div>
  );
}

// Wrap App component with Router at the top level
function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <SectionProvider>
          <App />
        </SectionProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;