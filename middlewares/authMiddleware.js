const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
   
        const decoded = jwt.verify(token, 'syfeVishnu'); 
        
        req.user = { id: decoded.id }; 
        next();
    } catch (error) {
        console.error('Token validation error:', error.message);
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
