import express from 'express';
import dotenv from 'dotenv';
import { TelegramService } from '../service/telegramService';

dotenv.config();

interface TelegramMessage {
    chatId: string | number;
    text: string;
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    disableNotification?: boolean;
  }

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';   
const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const router = express.Router();
const telegramService = new TelegramService();

router.post("/send-message", async (req, res) => {
    try {
        const { userId, message, disableNotification } = req.body;
        console.log('userId', userId, 'message', message, 'disableNotification', disableNotification);
        const response = await telegramService.sendMessage(userId, message, disableNotification);
        const data = response.status === 200 ? response.message : response;
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to send Telegram message',
            error: error
        });
    }
});


export default router;