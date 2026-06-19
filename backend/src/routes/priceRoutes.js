import express from 'express';
import { getPrices } from '../controllers/priceController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getPrices);

export default router;
