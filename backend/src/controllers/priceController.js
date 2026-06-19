import { STOCK_PRICES } from '../data/stocks.js';

export const getPrices = async (req, res) => {
    const timestamp = Date.now();
    const prices = req.user.subscriptions.map((ticker) => {
        const changePercent = (Math.random() - 0.5) * 0.04;
        const price = Math.max(1, STOCK_PRICES[ticker] * (1 + changePercent));

        return {
            ticker,
            price: Math.round(price * 100) / 100,
            timestamp
        };
    });

    res.set('Cache-Control', 'no-store');
    res.json({ prices });
};
