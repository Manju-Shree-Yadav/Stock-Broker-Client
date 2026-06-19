import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'stock-dashboard-demo-secret';

function createToken(user) {
    return jwt.sign(
        {
            email: user.email,
            subscriptions: user.subscriptions || []
        },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

export { createToken, verifyToken };
