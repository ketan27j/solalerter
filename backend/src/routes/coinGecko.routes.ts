import express from 'express';
import { prisma } from 'prisma-shared';
import dotenv from 'dotenv';

dotenv.config();
const COINGECKO_TRENDING_COIN_URL = process.env.COINGECKO_TRENDING_COIN_URL || 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=solana-ecosystem&order=market_cap_desc&per_page=10&page=1';   
const router = express.Router();

router.get("/get-trending-coins", async (req, res) => {
    try {
        const response = await fetch(COINGECKO_TRENDING_COIN_URL);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
});

export default router;