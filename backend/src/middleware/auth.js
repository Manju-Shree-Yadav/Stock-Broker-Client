import jwt from 'jsonwebtoken';
import { getUser } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'stock-dashboard-demo-secret';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = getUser(decoded.email);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

export default authMiddleware;
