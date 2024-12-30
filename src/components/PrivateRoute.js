import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkToken } from '../redux/authSlice'; // Assume this is an action to verify the token
import Loading from './Loading';

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token'); // Get the token from local storage
  const [loading, setLoading] = useState(true); // Add loading state
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user; // Check if user is authenticated by the presence of user object

  useEffect(() => {
    if (token) {
      dispatch(checkToken(token)).finally(() => setLoading(false)); // Set loading to false after token check
    } else {
      setLoading(false); // If no token, also stop loading
    }
  }, [token]);

  if (loading) {
    return <div><Loading /></div>; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;