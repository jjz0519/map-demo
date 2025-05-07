const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const logger = require('../config/logger');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        logger.info('Registration attempt', { username, ip: req.ip });

        // Validate input
        if (!username || !password) {
            logger.warn('Registration failed: Missing username or password', { username, ip: req.ip });
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        // Check if username exists
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
        if (error.message.includes('Password must contain')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        logger.info('Login attempt', { username, ip: req.ip });

        // Validate input
        if (!username || !password) {
            logger.warn('Login failed: Missing username or password', { username, ip: req.ip });
            return res.status(400).json({ message: 'Please provide username and password' });
        }

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

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        // Store token in session
        req.session.token = token;
        req.session.userId = user._id;

        logger.info('Login successful', { 
            username, 
            userId: user._id,
            ip: req.ip 
        });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        logger.error('Login error', { 
            error: error.message,
            stack: error.stack,
            ip: req.ip 
        });
        res.status(500).json({ message: 'Login failed' });
    }
});

// Logout route
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
router.get('/me', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        logger.info('User info request', { userId, ip: req.ip });

        const user = await User.findById(userId).select('-password');
        if (!user) {
            logger.warn('User info request failed: User not found', { userId, ip: req.ip });
            return res.status(404).json({ message: 'User not found' });
        }

        logger.info('User info retrieved successfully', { userId, ip: req.ip });
        res.json(user);
    } catch (error) {
        logger.error('User info error', { 
            error: error.message,
            stack: error.stack,
            ip: req.ip 
        });
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 