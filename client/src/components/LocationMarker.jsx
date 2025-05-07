import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import {
    Card,
    CardContent,
    Typography,
    Rating,
    Box
} from '@mui/material';

const LocationMarker = ({ location, onClick, selected, onClose }) => {
    return (
        <>
            <Marker
                position={{
                    lat: location.location.coordinates[1],
                    lng: location.location.coordinates[0]
                }}
                onClick={() => onClick(location)}
            />
            {selected && (
                <InfoWindow
                    position={{
                        lat: location.location.coordinates[1],
                        lng: location.location.coordinates[0]
                    }}
                    onCloseClick={onClose}
                >
                    <Card sx={{ minWidth: 200, maxWidth: 300 }}>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {location.title}
                            </Typography>
                            {location.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {location.description}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Rating value={location.rating} readOnly size="small" />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    ({location.rating})
                                </Typography>
                            </Box>
                            {location.price && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Price: ¥{location.price}
                                </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Created by: {location.createdBy.username}
                            </Typography>
                        </CardContent>
                    </Card>
                </InfoWindow>
            )}
        </>
    );
};

export default LocationMarker; 