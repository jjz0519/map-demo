import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // Check if user is logged in on mount, but only once
        if (!authChecked) {
            checkAuth();
            setAuthChecked(true);
        }
    }, [authChecked]);

    const checkAuth = async () => {
        try {
            // avoid executing getCurrentUser when the current page is the login page
            const isLoginPage = window.location.pathname === '/login';
            if (isLoginPage) {
                setUser(null);
                setLoading(false);
                return;
            }
            
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await authService.login(username, password);
            setUser(response.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Logout failed'
            };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 