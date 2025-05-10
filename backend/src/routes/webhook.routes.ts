import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from 'prisma-shared';
import { Pool } from 'pg';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

router.post("/helius-webhook", async (req, res) => {
    try {
        const request = JSON.stringify(req.body, null, 2);
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        let userId = 0;
        if(authHeader){
            userId = Number(authHeader);
            console.log('userId:', userId);
        }

        if (!request) {
            return res.status(400).json({ error: 'Invalid webhook payload' });
        }

        const response = await prisma.heliusResponse.create({
            data: {
                userId: userId,
                response: request,
            },
        });
        res.status(200).json({ message: 'Webhook received successfully' });
    } catch (error) {
        console.error('Error in /helius-webhook:', error);
        res.status(500).json({
            message: "Internal server error in webhook",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

export default router;