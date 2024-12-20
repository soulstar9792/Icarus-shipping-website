import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isValidToken, setIsValidToken] = useState(null); // null means loading
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Replace with your actual backend endpoint for token verification
          const response = await axios.post('http://localhost:5000/api/verify-token', { token });
          if (response.data.valid) {
            setIsValidToken(true); // Token is valid
          } else {
            setIsValidToken(false); // Token is not valid
          }
        } catch (error) {
          console.error('Token verification error:', error);
          setIsValidToken(false); // Set to false on error
        }
      } else {
        setIsValidToken(false); // No token present
      }
    };

    verifyToken();
  }, [token]);

  if (isValidToken === null) {
    return <div>Loading...</div>; // Optional loading state
  }
  return isValidToken ? children : <Navigate to="/login" message="Please login to access this page" />;
};

export default PrivateRoute;