import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import priceRoutes from './routes/priceRoutes.js';
import { SUPPORTED_STOCKS } from './data/stocks.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/prices', priceRoutes);

app.get(['/health', '/api/health'], (req, res) => {
    res.json({ status: 'ok', supportedStocks: SUPPORTED_STOCKS });
});

app.get('/', (req, res) => {
    res.send('Stock Broker Backend is running');
});

export default app;
