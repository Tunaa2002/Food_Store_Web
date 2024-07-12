import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class verifyToken {
    async verifyToken(req, res) {
        const { accessToken } = req.body;
        console.log(accessToken);
        if (!accessToken) {
            return res.status(400).json({ message: 'Token is required' });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({ username: decoded.username, role: decoded.role });
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
}

const VerifyToken = new verifyToken();
export default VerifyToken;