const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const auth = require('../middleware/auth');
const logger = require('../config/logger');

// create a new location marker
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, rating, price, location } = req.body;

        // validate the required fields
        if (!title || !rating || !location || !location.coordinates) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // create a new location marker
        const newLocation = new Location({
            title,
            description,
            rating,
            price,
            location: {
                type: 'Point',
                coordinates: location.coordinates
            },
            createdBy: req.user.id
        });

        await newLocation.save();
        logger.info('New location created', { 
            locationId: newLocation._id,
            userId: req.user.id 
        });

        res.status(201).json(newLocation);
    } catch (error) {
        logger.error('Error creating location', { 
            error: error.message,
            userId: req.user.id 
        });
        res.status(500).json({ message: 'Error creating location' });
    }
});

// get all location markers
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find()
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
        res.json(locations);
    } catch (error) {
        logger.error('Error fetching locations', { error: error.message });
        res.status(500).json({ message: 'Error fetching locations' });
    }
});

// get a specific location marker
router.get('/:id', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id)
            .populate('createdBy', 'username');
        
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        
        res.json(location);
    } catch (error) {
        logger.error('Error fetching location', { 
            error: error.message,
            locationId: req.params.id 
        });
        res.status(500).json({ message: 'Error fetching location' });
    }
});

// delete a location marker
router.delete('/:id', auth, async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        // check if the user is the creator
        if (location.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this location' });
        }

        await location.remove();
        logger.info('Location deleted', { 
            locationId: req.params.id,
            userId: req.user.id 
        });

        res.json({ message: 'Location deleted successfully' });
    } catch (error) {
        logger.error('Error deleting location', { 
            error: error.message,
            locationId: req.params.id,
            userId: req.user.id 
        });
        res.status(500).json({ message: 'Error deleting location' });
    }
});

module.exports = router; 