import { createToken } from '../utils/token.js';

function createUser(email) {
    const normalizedEmail = String(email || '').trim().toLowerCase();

    return {
        id: normalizedEmail,
        email: normalizedEmail,
        subscriptions: []
    };
}

function authenticate(req, res, statusCode, message) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const user = createUser(email);

    return res.status(statusCode).json({
        message,
        token: createToken(user),
        user
    });
}

export const register = async (req, res) => {
    try {
        return authenticate(req, res, 201, 'User ready');
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Server error during registration' });
    }
};

export const login = async (req, res) => {
    try {
        return authenticate(req, res, 200, 'Login successful');
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Server error during login' });
    }
};
