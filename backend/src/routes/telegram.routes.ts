import express from 'express';
import { prisma } from 'prisma-shared';
import dotenv from 'dotenv';

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

router.post("/send-message", async (req, res) => {
    try {
        const { userId, message, disableNotification } = req.body;
        console.log('userId', userId, 'message', message, 'disableNotification', disableNotification);
        let telegramChatId = ''
        //get telegram id from user id from db using prisma
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }, select: {
                telegramId: true
            }
        });
        if(!user) {
            res.status(400).json({
                message: 'Telegram id not found for user '+userId
            });
        }
        let telegramId = user?.telegramId || '';
        telegramId = telegramId.replace('@', '').toLowerCase();        
        const resUpdates = await fetch(apiUrl + '/getUpdates');
        // console.log('resUpdates', resUpdates);
        if(!resUpdates.ok) {
            res.status(400).json({
                message: 'Telegram chat id not found for user '+userId
            });
        } else {
            const resData = await resUpdates.json();
            const result = resData.result;
            if(result && result.length > 0) {
                // Loop through all updates to find matching username
                for (const update of result) {
                    if (update.message && 
                        update.message.chat && 
                        update.message.chat.username?.toLowerCase() === telegramId) {
                            telegramChatId = update.message.chat.id.toString();
                            console.log('Found matching telegramChatId', telegramChatId);
                            break; // Exit loop after finding the first match
                    }
                }
                // If no matching username was found, you might want to log it
                if (!telegramChatId) {
                    console.log('No chat found with username:', telegramId);
                }
            }
        }
        console.log('telegramId', telegramId, 'apiUrl', apiUrl);
        const response = await fetch(apiUrl + '/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: '🚨'+message,
                parse_mode: 'HTML',
                disable_notification: disableNotification
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to send Telegram message',
            error: error
        });
    }
});export default router;