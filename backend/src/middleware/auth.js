import { verifyToken } from '../utils/token.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token provided' });
        }

        const decoded = verifyToken(token);

        req.user = {
            id: decoded.email,
            email: decoded.email,
            subscriptions: Array.isArray(decoded.subscriptions) ? decoded.subscriptions : []
        };
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

export default authMiddleware;
