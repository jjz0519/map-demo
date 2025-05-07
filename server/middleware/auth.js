const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from session
        const token = req.session.token;
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
};

module.exports = auth; 