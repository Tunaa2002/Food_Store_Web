import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.headers['authorization']?.split(' ')[1]; // Allow token in body or header

    if (!token) {
        return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

export default verifyToken;
