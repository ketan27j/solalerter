import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from 'prisma-shared';
import { AlertService } from '../service/alertService';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();
const alertService = new AlertService();

router.post("/send-alerts", async (req, res) => {
    try {
        const response = await alertService.analyzeSubscriptionSentiment(4);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in /helius-webhook:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
    });

export default router;