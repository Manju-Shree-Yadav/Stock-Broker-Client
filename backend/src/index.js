import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/authRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

// Import socket handler
import { initializeSocket, SUPPORTED_STOCKS } from './socket/socketHandler.js';

// MongoDB connection
import dbConnect from './db/dbConnect.js';

const app = express();
const httpServer = createServer(app);

// MongoDB Connection
dbConnect();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io setup with CORS
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Initialize Socket.io handlers
initializeSocket(io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', supportedStocks: SUPPORTED_STOCKS });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Supported stocks: ${SUPPORTED_STOCKS.join(', ')}`);
});
