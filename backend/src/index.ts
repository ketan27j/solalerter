import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import subscriptionRoutes from './routes/subscription.routes';

dotenv.config();
const app = express()

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'clientApp')));



app.get("/status", async (req, res) => {
    try {
        res.status(200).json({
            message: "Ok"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
});


// Import routes
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import coinGeckoRoutes from './routes/coinGecko.routes';
import telegramRoutes from './routes/telegram.routes';
import webhookRoutes from './routes/webhook.routes';
import { authenticateJWT } from "./middleware/auth.middleware";

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authenticateJWT, userRoutes);
app.use('/api/subscription', authenticateJWT, subscriptionRoutes);   
app.use('/api/coingecko', coinGeckoRoutes);
app.use('/api/telegram', telegramRoutes);
app.use('/api/webhook', webhookRoutes);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'clientApp', 'index.html'));
});
app.listen(3004, () => {
    console.log("server is running on port 3004");
})
