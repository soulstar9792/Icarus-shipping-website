import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Access the correct variable name

  return currentUser ? children : <Navigate to="/login" message="Please login to access this page" />;
};

export default PrivateRoute;