import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from 'prisma-shared';

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
        let subscriptionId = 0;
        if(authHeader){
            subscriptionId = Number(authHeader);
            console.log('subscriptionId:', subscriptionId);
        }

        if (!request) {
            return res.status(400).json({ error: 'Invalid webhook payload' });
        }
        //get user id from subscription id
        const userId = await prisma.subscription.findUnique({
            where: {
                id: subscriptionId,
            },
            select: {
                userId: true,
            },
        });

        const response = await prisma.heliusResponse.create({
            data: {
                userId: Number(userId),
                subscriptionId: subscriptionId,
                response: request,
            },
        });
        if (!response) {
            return res.status(500).json({ error: 'Failed to save response' });
        }
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