import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authService = {
    login: async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    register: async (username, password) => {
        try {
            const response = await api.post('/auth/register', { username, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Logout failed' };
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get user info' };
        }
    }
};

export const locationService = {
    createLocation: async (locationData) => {
        try {
            const response = await api.post('/locations', locationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create location' };
        }
    },

    getLocations: async () => {
        try {
            const response = await api.get('/locations');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch locations' };
        }
    },

    deleteLocation: async (id) => {
        try {
            const response = await api.delete(`/locations/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete location' };
        }
    }
};

export default api; 