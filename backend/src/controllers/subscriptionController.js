import { SUPPORTED_STOCKS } from '../data/stocks.js';
import { createToken } from '../utils/token.js';

function subscriptionResponse(user, message) {
    return {
        message,
        subscriptions: user.subscriptions,
        supportedStocks: SUPPORTED_STOCKS,
        token: createToken(user)
    };
}

export const getSubscriptions = async (req, res) => {
    res.json(subscriptionResponse(req.user, 'Subscriptions loaded'));
};

export const subscribe = async (req, res) => {
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

    const user = {
        ...req.user,
        subscriptions: [...req.user.subscriptions, ticker]
    };

    return res.json(subscriptionResponse(user, `Successfully subscribed to ${ticker}`));
};

export const unsubscribe = async (req, res) => {
    const ticker = String(req.params.ticker || '').trim().toUpperCase();

    if (!SUPPORTED_STOCKS.includes(ticker)) {
        return res.status(400).json({ error: `Stock ${ticker} is not supported` });
    }

    if (!req.user.subscriptions.includes(ticker)) {
        return res.status(400).json({ error: `Not subscribed to ${ticker}` });
    }

    const user = {
        ...req.user,
        subscriptions: req.user.subscriptions.filter((subscribedTicker) => subscribedTicker !== ticker)
    };

    return res.json(subscriptionResponse(user, `Successfully unsubscribed from ${ticker}`));
};
