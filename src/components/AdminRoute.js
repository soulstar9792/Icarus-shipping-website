// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
    const user = useSelector(state => state.auth.user); // Get the user from Redux state
    

    // Check if the user is an admin based on your user structure
    
    if (!user || user.user_role !== 'admin') {
        return <Navigate to="/" replace />; // Redirect non-admin users
    }

    return children; // Render children if user is admin
};

export default AdminRoute;