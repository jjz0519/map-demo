import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Paper,
    Container,
    Fab
} from '@mui/material';
import { Search as SearchIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 128px)' // Account for header and footer
};

const defaultCenter = {
    lat: 0,
    lng: 0
};

const Map = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [map, setMap] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/login');
        }
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Map Demo
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {user?.username}
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1, position: 'relative' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={defaultCenter}
                    zoom={2}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    {/* Add markers here */}
                </GoogleMap>

                <Fab
                    color="primary"
                    sx={{ position: 'absolute', top: 16, left: 16 }}
                    onClick={() => setSearchOpen(true)}
                >
                    <SearchIcon />
                </Fab>
            </Box>

            <Paper
                component="footer"
                sx={{
                    py: 2,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) => theme.palette.grey[200]
                }}
            >
                <Container maxWidth="sm">
                    <Typography variant="body2" color="text.secondary" align="center">
                        Version 1.0.0
                    </Typography>
                </Container>
            </Paper>
        </Box>
    );
};

export default Map; 