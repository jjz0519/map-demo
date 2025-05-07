const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const logger = require('../config/logger');
const auth = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        logger.info('Registration attempt', { username, ip: req.ip });

        // Validate input
        if (!username || !password) {
            logger.warn('Registration failed: Missing username or password', { username, ip: req.ip });
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            logger.warn('Registration failed: Username already exists', { username, ip: req.ip });
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const user = new User({ username, password });

        // Validate user
        const validationError = user.validateSync();
        if (validationError) {
            const errors = Object.values(validationError.errors).map(err => err.message);
            logger.warn('Registration failed: Validation error', { 
                username, 
                errors, 
                ip: req.ip 
            });
            return res.status(400).json({ message: errors[0] });
        }

        await user.save();
        logger.info('User registration successful', { 
            username, 
            userId: user._id,
            ip: req.ip 
        });
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        logger.error('Registration error', { 
            error: error.message,
            stack: error.stack,
            ip: req.ip 
        });
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        res.status(500).json({ message: 'Registration failed' });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        logger.info('Login attempt', { username, ip: req.ip });

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            logger.warn('Login failed: User not found', { username, ip: req.ip });
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            logger.warn('Login failed: Invalid password', { username, ip: req.ip });
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Update last login time
        user.lastLogin = new Date();
        await user.save();

        // Set session
        req.session.userId = user._id;
        logger.info('Login successful', { 
            username, 
            userId: user._id,
            ip: req.ip 
        });
        res.json({ message: 'Login successful' });
    } catch (error) {
        logger.error('Login error', { 
            error: error.message,
            stack: error.stack,
            ip: req.ip 
        });
        res.status(500).json({ message: 'Login failed' });
    }
});

// User logout
router.post('/logout', (req, res) => {
    const userId = req.session.userId;
    logger.info('Logout attempt', { userId, ip: req.ip });

    req.session.destroy((err) => {
        if (err) {
            logger.error('Logout error', { 
                error: err.message,
                stack: err.stack,
                userId,
                ip: req.ip 
            });
            return res.status(500).json({ message: 'Logout failed' });
        }
        logger.info('Logout successful', { userId, ip: req.ip });
        res.json({ message: 'Logout successful' });
    });
});

// Get current user
router.get('/me', (req, res) => {
    const userId = req.session.userId;
    logger.info('User info request', { userId, ip: req.ip });

    if (!userId) {
        logger.warn('User info request failed: Not authenticated', { ip: req.ip });
        return res.status(401).json({ message: 'Not authenticated' });
    }
    
    logger.info('User info retrieved successfully', { userId, ip: req.ip });
    res.json({ userId });
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findById(req.user.id);

        if (username) {
            // Check if username is already taken
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== req.user.id) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username;
        }

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 