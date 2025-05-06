import express, { Request, Response } from 'express';
import { googleAuthHandler, refreshToken, authenticateJWT } from '../middleware/auth.middleware';

const router = express.Router();

// Google authentication route
router.post('/google', googleAuthHandler )

// Token refresh route
router.post('/refresh-token', refreshToken);

// Test protected route
router.get('/me', authenticateJWT, (req: any, res: any) => {
  // @ts-ignore - user is attached by the authenticateJWT middleware
  res.json({ user: req.user });
});


export default router;
