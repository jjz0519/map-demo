import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // save the path to state to return after logging in
        return <Navigate to="/login" state={{ from: location.pathname }} />;
    }

    return children;
};

export default ProtectedRoute; 