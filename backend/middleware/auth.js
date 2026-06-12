import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    // 1. Grab the token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. If there is no token, block the request
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        // 3. Verify the token using your secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the decoded user payload to the request object
        req.user = verified; 
        
        // 5. Move on to the actual route handler
        next(); 
    } catch (error) {
        // If the token is fake or expired, block the request
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

export default authenticateToken;