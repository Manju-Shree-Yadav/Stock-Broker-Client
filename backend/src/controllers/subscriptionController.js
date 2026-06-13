import { SUPPORTED_STOCKS } from '../data/stocks.js';
import { updateUserSubscriptions } from '../models/User.js';

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

export const subscribe = async (req, res) => {
    try {
        const ticker = String(req.body.ticker || '').trim().toUpperCase();

        if (!ticker) {
            return res.status(400).json({ error: 'Ticker is required' });
        }

        if (!SUPPORTED_STOCKS.includes(ticker)) {
            return res.status(400).json({ error: `Stock ${ticker} is not supported. Supported stocks: ${SUPPORTED_STOCKS.join(', ')}` });
        }

        if (req.user.subscriptions.includes(ticker)) {
            return res.status(400).json({ error: `Already subscribed to ${ticker}` });
        }

        const user = updateUserSubscriptions(req.user.email, [...req.user.subscriptions, ticker]);

        res.json({
            message: `Successfully subscribed to ${ticker}`,
            subscriptions: user.subscriptions
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

export const unsubscribe = async (req, res) => {
    try {
        const ticker = String(req.params.ticker || '').trim().toUpperCase();

        if (!SUPPORTED_STOCKS.includes(ticker)) {
            return res.status(400).json({ error: `Stock ${ticker} is not supported` });
        }

        if (!req.user.subscriptions.includes(ticker)) {
            return res.status(400).json({ error: `Not subscribed to ${ticker}` });
        }

        const user = updateUserSubscriptions(
            req.user.email,
            req.user.subscriptions.filter((subscribedTicker) => subscribedTicker !== ticker)
        );

        res.json({
            message: `Successfully unsubscribed from ${ticker}`,
            subscriptions: user.subscriptions
        });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};
