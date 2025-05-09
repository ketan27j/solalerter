import express from 'express';
import { prisma } from 'prisma-shared';

const router = express.Router();

router.get("/status", async (req, res) => {
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

router.get("/get-user", async (req: any, res: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                name: true,
                telegramId: true,
            }
        });
        if(user) {
            res.status(200).json({
                success: true,
                user: user
            });
        }} catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error",
                error: error
        });
    }
});

router.post("/save-user", async (req: any, res: any) => {
    try {
        const user = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                name: req.body.userName,
                telegramId: req.body.telegramId,
            }
        });
        if(user) {
            res.status(200).json({
                success: true,
                user: user
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
});

export default router;