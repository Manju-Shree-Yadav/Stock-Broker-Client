import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { SUPPORTED_STOCKS, STOCK_PRICES } from '../data/stocks.js';

// Initialize stock prices from data file So that we can change them in the file and have the server pick up the changes dynamically
const stockPrices = { ...STOCK_PRICES };

// Store user sessions with their subscriptions
const userSessions = new Map();

// Generate random price change 
// Simulates real-time stock price fluctuations 
function generatePriceChange(currentPrice) {

    // Random change between -0.275 and +0.275 (approx ±0.55%) 
    const changePercent = (Math.random() - 0.5) * 0.55;

    // Calculate new price
    const newPrice = currentPrice * (1 + changePercent);
    return Math.round(newPrice * 100) / 100;
}

// Initialize Socket.io handlers 
// Handles authentication, subscription management, and real-time stock updates
function initializeSocket(io) {

    // Update stock prices every second and notify subscribed users
    setInterval(() => {
        SUPPORTED_STOCKS.forEach(ticker => {
            stockPrices[ticker] = generatePriceChange(stockPrices[ticker]);
        });

        // Send updates to all connected and authenticated clients for ALL stocks
        io.sockets.sockets.forEach((socket) => {
            const userSession = userSessions.get(socket.id);
            if (userSession) {
                // Send all stock prices to all authenticated users
                SUPPORTED_STOCKS.forEach(ticker => {
                    socket.emit('stock-update', {
                        ticker: ticker,
                        price: stockPrices[ticker],
                        timestamp: Date.now()
                    });
                });
            }
        });
    }, 1000);

    // Socket.io connection handling 
    io.on('connection', async (socket) => {
        console.log('Client connected:', socket.id);

        // Authenticate socket connection with JWT
        socket.on('authenticate', async (token) => {
            try {
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
                );
                const user = await User.findById(decoded.userId);

                if (!user) {
                    socket.emit('auth-error', 'User not found');
                    return;
                }

                // Store user session with subscriptions from database
                userSessions.set(socket.id, {
                    userId: user._id,
                    email: user.email,
                    subscriptions: new Set(user.subscriptions)
                });

                console.log('User authenticated:', user.email);
                socket.emit('auth-success', {
                    email: user.email,
                    supportedStocks: SUPPORTED_STOCKS,
                    subscriptions: user.subscriptions
                });

                // Send initial prices for ALL stocks immediately upon authentication
                SUPPORTED_STOCKS.forEach(ticker => {
                    socket.emit('stock-update', {
                        ticker: ticker,
                        price: stockPrices[ticker],
                        timestamp: Date.now()
                    });
                });
            } catch (error) {
                console.error('Authentication error:', error);
                socket.emit('auth-error', 'Invalid token');
            }
        });



        // Handle subscription updates from client 
        // When user updates their subscriptions, fetch latest from DB and send current prices for ALL stocks 
        socket.on('update-subscriptions', async (data) => {
            try {
                const userSession = userSessions.get(socket.id);
                if (userSession) {
                    // Fetch latest user data from database
                    const user = await User.findById(userSession.userId);
                    if (user) {
                        userSession.subscriptions = new Set(user.subscriptions);
                        console.log(`Updated subscriptions for ${user.email}:`, user.subscriptions);

                        // Send current prices for ALL stocks (not just subscribed)
                        SUPPORTED_STOCKS.forEach(ticker => {
                            socket.emit('stock-update', {
                                ticker: ticker,
                                price: stockPrices[ticker],
                                timestamp: Date.now()
                            });
                        });
                    }
                }
            } catch (error) {
                console.error('Error updating subscriptions:', error);
            }
        });



        // Handle disconnect event
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
