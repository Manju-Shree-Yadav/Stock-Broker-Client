import jwt from 'jsonwebtoken';
import { getOrCreateUser } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'stock-dashboard-demo-secret';

function createToken(user) {
    return jwt.sign(
        { email: user.email },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
}

export const register = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = getOrCreateUser(email);
        const token = createToken(user);

        res.status(201).json({
            message: 'User ready',
            token,
            user
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration', details: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = getOrCreateUser(email);
        const token = createToken(user);

        res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login', details: error.message });
    }
};
