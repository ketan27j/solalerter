import { prisma } from 'prisma-shared';
import dotenv from "dotenv";

dotenv.config();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';   
const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export class TelegramService {
    async sendMessage(userId: string, message: string, disableNotification?: boolean) {
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
            return {status:400, message: 'Telegram id not found for user ' + userId}
        }
        let telegramId = user?.telegramId || '';
        telegramId = telegramId.replace('@', '').toLowerCase();        
        const resUpdates = await fetch(apiUrl + '/getUpdates');
        // console.log('resUpdates', resUpdates);
        if(!resUpdates.ok) {
            return{
                status: 400,
                message: 'Telegram chat id not found for user '+userId
            };
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
        if(response.ok) {
            return {
                status: 200,
                message: 'Telegram chat sent successfully for '+userId
            };
        } else {
            return {
                status: 400,
                message: 'Telegram chat failed for '+userId
            };
        }
    }
}