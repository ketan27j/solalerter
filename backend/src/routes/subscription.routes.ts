import express from 'express';
import { Address, Helius, TransactionType, WebhookType } from 'helius-sdk';
import { prisma, SubscriptionStatus } from 'prisma-shared';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const router = express.Router();
const HELIUS_API_KEY: string = process.env.HELIUS_API_KEY || '';
const webhookUrl: string = process.env.WEBHOOK_URL || '';
const helius = new Helius(HELIUS_API_KEY)
console.log('webhookUrl:', webhookUrl);

router.post("/new-subscription", async (req: any, res: any) => {
    try {
        const { address, transactionType, addressType } = req.body;
        console.log('address:', address);
        console.log('transactionType:', transactionType);
        const response = await prisma.subscription.create({
            data: {
                userId : req.user.id,
                webhookUrl: webhookUrl,
                address: address,
                transactionType: transactionType,
                addressType: addressType,
            },
          });
          if(response) {
            res.status(200).json({
                success: true,
            });
        }
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
});

router.get("/all-subscriptions", async (req:any, res:any) => {
    try {
        const subscriptions = await prisma.subscription.findMany(
            {
                where: {
                    userId: req.user.id
                }
            }
        );
        if(subscriptions) {
            res.status(200).json({
                success: true,
                subscriptions: subscriptions
            });
        }
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

router.get("/active-subscriptions", async (req:any, res:any) => {
    try {
        const subscriptionCount = await prisma.subscription.count(
            {
                where: {
                    userId: req.user.id,
                    status: SubscriptionStatus.RUNNING
                }
            }
        );
        if(subscriptionCount) {
            res.status(200).json({
                success: true,
                subscriptionCount: subscriptionCount
            });
        }
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

router.post("/delete-subscription", async (req:any, res:any) => {
    try {
        const { id } = req.body;
        const response = await prisma.subscription.delete({
            where: {
                id: id,
                userId: req.user.id 
            }
        });
        if(response) {
            res.status(200).json({
                success: true,
            });
        }
    } catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).json({ error: 'Failed to delete subscription' });
    }
});

router.post('/start-subscription', async (req: any, res: any) => {
    try {
        const { id } = req.body;
        const subscription = await prisma.subscription.findUnique({
            where: {
                id: id
            }
        });
        if(subscription) {
            const webhookResponse = await helius.createWebhook({
                authHeader: req.user.id.toString(),
                webhookURL: subscription.webhookUrl || webhookUrl,
                webhookType: WebhookType.ENHANCED_DEVNET,
                transactionTypes: [subscription.transactionType as TransactionType],
                accountAddresses: [subscription.address as Address], 
            });
            if (webhookResponse && webhookResponse.webhookID) {
                const response = await prisma.subscription.update({
                    where: {
                        id: id
                    },
                    data: {
                        webhookId: webhookResponse.webhookID,
                        status: SubscriptionStatus.RUNNING,
                        updatedAt: new Date()
                    }
                });
                if(response) {
                    res.status(200).json({
                        success: true,
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error registering webhook:', error);
        res.status(500).json({ error: 'Failed to register webhook' });
    }
});

router.post('/stop-subscription', async (req, res) => {
    try {
        const { id } = req.body;
        const subscription = await prisma.subscription.findUnique({
            where: {
                id: id
            }
        });
        if(subscription && subscription.webhookId) {
            const webhookResponse = await helius.deleteWebhook(subscription.webhookId);
            if (webhookResponse) {
                const response = await prisma.subscription.update({
                    where: {
                        id: id
                    },
                    data: {
                        webhookId: null,
                        status: SubscriptionStatus.STOPPED
                    }
                });
                if(response) {
                    res.status(200).json({
                        success: true,
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error stopping subscription:', error);
        res.status(500).json({ error: 'Failed to stop subscription' });
    }
}); 

router.get('/get-webhook', async (req, res) => {
    try {
        const HELIUS_API_KEY: string = process.env.HELIUS_API_KEY || '';
        const helius = new Helius(HELIUS_API_KEY)
        helius.getAllWebhooks().then((webhooks) => {
            res.status(200).json({
                success: true,
                webhooks: webhooks
            });
        });
    } catch (error) {
        console.error('Error registering webhook:', error);
        res.status(500).json({ error: 'Failed to register webhook' });
    }
});

router.post('/delete-webhook', async (req, res) => {
    try {
        const HELIUS_API_KEY: string = process.env.HELIUS_API_KEY || '';
        const webhookUrl: string = process.env.WEBHOOK_URL || '';
        const helius = new Helius(HELIUS_API_KEY)
        let webhookId = req.body.webhookId;
        console.log('webhookId:', webhookId);
        const webhookResponse = await helius.deleteWebhook(webhookId);

        if (webhookResponse) {
            res.status(200).json({
                success: true,
            });
        } else {
            res.status(500).json({ error: 'Failed to delete webhook' });
        }
    } catch (error) {
        console.error('Error deleting webhook:', error);
        res.status(500).json({ error: 'Failed to delete webhook' });
    }
});

export default router;