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
        // 将当前路径记录在状态中，以便登录后可以返回
        return <Navigate to="/login" state={{ from: location.pathname }} />;
    }

    return children;
};

export default ProtectedRoute; 