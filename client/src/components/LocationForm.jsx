import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Rating,
    Box,
    Typography
} from '@mui/material';
import { locationService } from '../services/api';

const LocationForm = ({ open, onClose, position, onLocationCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rating: 0,
        price: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            rating: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Please enter a title');
            return;
        }

        if (formData.title.trim().length < 3) {
            setError('Title must be at least 3 characters long');
            return;
        }

        if (!formData.rating) {
            setError('Please select a rating');
            return;
        }

        if (formData.price && (isNaN(formData.price) || Number(formData.price) < 0)) {
            setError('Price must be a positive number');
            return;
        }

        try {
            const response = await locationService.createLocation({
                ...formData,
                location: {
                    coordinates: [position.lng, position.lat]
                }
            });

            onLocationCreated(response);
            onClose();
            setFormData({
                title: '',
                description: '',
                rating: 0,
                price: ''
            });
        } catch (err) {
            setError(err.message || 'Failed to create location marker');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Location</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        margin="normal"
                        error={error && error.includes('title')}
                        helperText="Title must be at least 3 characters"
                        slotProps={{ htmlInput: { maxLength: 50 }}}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <Box sx={{ my: 2 }}>
                        <Typography component="legend">Rating</Typography>
                        <Rating
                            name="rating"
                            value={formData.rating}
                            onChange={handleRatingChange}
                            required
                        />
                    </Box>
                    <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        margin="normal"
                        error={error && error.includes('price')}
                        helperText="Optional - enter a positive number"
                        slotProps={{ htmlInput : {
                            startAdornment: <span style={{ marginRight: '8px' }}>$</span>,
                            min: 0,
                            step: 0.01}
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default LocationForm; 