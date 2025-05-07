import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Paper,
    Container,
    Fab,
    CircularProgress,
    Backdrop
} from '@mui/material';
import { Search as SearchIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LocationForm from '../components/LocationForm';
import LocationMarker from '../components/LocationMarker';
import SearchBox from '../components/SearchBox';
import { locationService } from '../services/api';
import Toast from '../components/Toast';

const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 128px)' // Account for header and footer
};

// default center - Auckland, New Zealand
const defaultCenter = {
    lat: -36.8485,
    lng: 174.7633
};

const libraries = ['marker'];

// Map options for better user experience
const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true
};

const Map = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [map, setMap] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [clickPosition, setClickPosition] = useState(null);
    const [center, setCenter] = useState(defaultCenter);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [isLoading, setIsLoading] = useState(true);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries
    });

    // get the user's location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCenter = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCenter(newCenter);
                    setToast({
                        open: true,
                        message: 'Location set to your current position',
                        severity: 'success'
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setToast({
                        open: true,
                        message: `Failed to get your location: ${error.message}`,
                        severity: 'error'
                    });
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            setToast({
                open: true,
                message: 'Geolocation is not supported by your browser',
                severity: 'error'
            });
        }
    }, []);

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

    const fetchLocations = async () => {
        try {
            const data = await locationService.getLocations();
            setLocations(data);
            if (data.length === 0) {
                setToast({
                    open: true,
                    message: 'No location markers found. Click on the map to add some!',
                    severity: 'info'
                });
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            setToast({
                open: true,
                message: 'Failed to fetch locations. Please try again.',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded) {
            fetchLocations();
        }
    }, [isLoaded]);

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setClickPosition({ lat, lng });
        setFormOpen(true);
    };

    const handleLocationCreated = (newLocation) => {
        setLocations(prev => [...prev, newLocation]);
        setSelectedLocation(newLocation);
        
        // Pan to the new location
        if (map) {
            map.panTo({
                lat: newLocation.location.coordinates[1],
                lng: newLocation.location.coordinates[0]
            });
            map.setZoom(15); // Zoom in a bit to see the new location better
        }
        
        setToast({
            open: true,
            message: 'Location marker added',
            severity: 'success'
        });
    };

    const handleMarkerClick = (location) => {
        setSelectedLocation(location);
    };

    const handleInfoWindowClose = () => {
        setSelectedLocation(null);
    };

    const handleToastClose = () => {
        setToast(prev => ({ ...prev, open: false }));
    };

    const handleSearchSelect = (location) => {
        setSelectedLocation(location);
        setSearchOpen(false);
        if (map) {
            map.panTo({
                lat: location.location.coordinates[1],
                lng: location.location.coordinates[0]
            });
        }
    };

    if (!isLoaded) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                padding: 3,
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" align="center">
                    Loading Google Maps...
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
                    If this takes too long, please check your API key or internet connection.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Toast
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={handleToastClose}
            />
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
                    center={center}
                    zoom={13}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={handleMapClick}
                    options={mapOptions}
                >
                    {locations.map(location => (
                        <LocationMarker
                            key={location._id}
                            location={location}
                            onClick={handleMarkerClick}
                            selected={selectedLocation?._id === location._id}
                            onClose={handleInfoWindowClose}
                            map={map}
                        />
                    ))}
                </GoogleMap>

                <Fab
                    color="primary"
                    aria-label="search locations"
                    sx={{ 
                        position: 'absolute', 
                        top: { xs: 16, sm: 90 },
                        left: 16,
                        zIndex: 1 
                    }}
                    onClick={() => setSearchOpen(!searchOpen)}
                >
                    <SearchIcon />
                </Fab>

                {searchOpen && (
                    <SearchBox
                        locations={locations}
                        onLocationSelect={handleSearchSelect}
                    />
                )}

                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>

            <LocationForm
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setClickPosition(null);
                }}
                position={clickPosition}
                onLocationCreated={handleLocationCreated}
            />

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