import { SUPPORTED_STOCKS } from '../data/stocks.js';

// Get user subscriptions
export const getSubscriptions = async (req, res) => {
    try {
        res.json({
            subscriptions: req.user.subscriptions,
            supportedStocks: SUPPORTED_STOCKS
        });
    } catch (error) {
        console.error('Get subscriptions error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// Subscribe to a stock
export const subscribe = async (req, res) => {
    try {
        const { ticker } = req.body;

        if (!ticker) {
            return res.status(400).json({ error: 'Ticker is required' });
        }

        if (!SUPPORTED_STOCKS.includes(ticker)) {
            return res.status(400).json({ error: `Stock ${ticker} is not supported. Supported stocks: ${SUPPORTED_STOCKS.join(', ')}` });
        }

        if (req.user.subscriptions.includes(ticker)) {
            return res.status(400).json({ error: `Already subscribed to ${ticker}` });
        }

        req.user.subscriptions.push(ticker);
        await req.user.save();

        res.json({
            message: `Successfully subscribed to ${ticker}`,
            subscriptions: req.user.subscriptions
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// Unsubscribe from a stock
export const unsubscribe = async (req, res) => {
    try {
        const { ticker } = req.params;

        if (!SUPPORTED_STOCKS.includes(ticker)) {
            return res.status(400).json({ error: `Stock ${ticker} is not supported` });
        }

        if (!req.user.subscriptions.includes(ticker)) {
            return res.status(400).json({ error: `Not subscribed to ${ticker}` });
        }

        req.user.subscriptions = req.user.subscriptions.filter(t => t !== ticker);
        await req.user.save();

        res.json({
            message: `Successfully unsubscribed from ${ticker}`,
            subscriptions: req.user.subscriptions
        });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};
