import jwt from 'jsonwebtoken';
import { SUPPORTED_STOCKS, STOCK_PRICES } from '../data/stocks.js';
import { getUser } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'stock-dashboard-demo-secret';
const stockPrices = { ...STOCK_PRICES };
const userSessions = new Map();

function generatePriceChange(currentPrice) {
    const changePercent = (Math.random() - 0.5) * 0.02;
    const nextPrice = currentPrice * (1 + changePercent);
    return Math.max(1, Math.round(nextPrice * 100) / 100);
}

function emitSubscribedPrices(socket, subscriptions) {
    subscriptions.forEach((ticker) => {
        socket.emit('stock-update', {
            ticker,
            price: stockPrices[ticker],
            timestamp: Date.now()
        });
    });
}

function initializeSocket(io) {
    setInterval(() => {
        SUPPORTED_STOCKS.forEach((ticker) => {
            stockPrices[ticker] = generatePriceChange(stockPrices[ticker]);
        });

        io.sockets.sockets.forEach((socket) => {
            const userSession = userSessions.get(socket.id);

            if (userSession) {
                emitSubscribedPrices(socket, userSession.subscriptions);
            }
        });
    }, 1000);

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('authenticate', (token) => {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                const user = getUser(decoded.email);

                if (!user) {
                    socket.emit('auth-error', { error: 'User not found' });
                    return;
                }

                userSessions.set(socket.id, {
                    email: user.email,
                    subscriptions: new Set(user.subscriptions)
                });

                socket.emit('auth-success', {
                    email: user.email,
                    supportedStocks: SUPPORTED_STOCKS,
                    subscriptions: user.subscriptions
                });
                emitSubscribedPrices(socket, user.subscriptions);
            } catch (error) {
                console.error('Authentication error:', error);
                socket.emit('auth-error', { error: 'Invalid token' });
            }
        });

        socket.on('update-subscriptions', () => {
            const userSession = userSessions.get(socket.id);

            if (!userSession) {
                return;
            }

            const user = getUser(userSession.email);

            if (!user) {
                return;
            }

            userSession.subscriptions = new Set(user.subscriptions);
            emitSubscribedPrices(socket, user.subscriptions);
        });

        socket.on('disconnect', () => {
            const userSession = userSessions.get(socket.id);

            if (userSession) {
                console.log('User disconnected:', userSession.email);
                userSessions.delete(socket.id);
            }
        });
    });
}

export { initializeSocket, SUPPORTED_STOCKS };
