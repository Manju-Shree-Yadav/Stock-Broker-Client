import express from 'express';
import { getSubscriptions, subscribe, unsubscribe } from '../controllers/subscriptionController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All subscription routes require authentication
router.use(authMiddleware);

// GET /api/subscriptions - Get user's subscriptions
router.get('/', getSubscriptions);

// POST /api/subscriptions - Subscribe to a stock
router.post('/', subscribe);

// DELETE /api/subscriptions/:ticker - Unsubscribe from a stock
router.delete('/:ticker', unsubscribe);

export default router;
