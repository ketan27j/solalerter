import express, { Request, Response, NextFunction, Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { PrismaClient } from 'prisma-shared';
import dotenv from 'dotenv';

delete require.cache[require.resolve('dotenv')];
dotenv.config();

const prisma = new PrismaClient();
const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
if (!CLIENT_ID) {
  console.error('Google Client ID is not set in backend environment variables');
}
// Create a new OAuth client
const client = new OAuth2Client(CLIENT_ID);

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    password: string;
    googleId: string;
    createdAt: Date;
    updatedAt: Date;
    postgresCredentials: string | null;
    walletAddress: string | null;
  };
}

/**
 * Middleware to handle Google authentication
 */
const router = express.Router();
export const googleAuthHandler = async (req: Request, res: Response) => {
  try {
    console.log('Received Google Auth request');
    const { idToken } = req.body;

    if (!idToken) {
      // return res.status(400).json({ error: 'ID token is required' });
      res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      // return res.status(401).json({ error: 'Invalid token payload' });
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }

    const { sub: googleId, email, name, picture } = payload;
    console.log(`sub: ${googleId}, email: ${email}, name: ${name}, picture: ${picture}`);
    if (!googleId || !email) {
      // return res.status(401).json({ error: 'Invalid token data' });
      res.status(401).json({ error: 'Invalid token data' });
      return;
    }

    // Find or create user in the database
    let user = await prisma.user.findFirst({
      where: { googleId: googleId },
    });

    if (!user) {
      // Create new user if not exists
      user = await prisma.user.create({
        data: {
          googleId,
          email,
          name: name || '',
          password: ''
        },
      });
    } else {
      // Update existing user info
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email,
          name: name || user.name
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    // return res.status(200).json({
    res.status(200).json({
      message: 'Authentication successful',
      token,
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        // profilePicture: user.profileImageUrl,
      },
    });
    return;
  } catch (error) {
    console.error('Google authentication error:', error);
    // return res.status(401).json({ error: 'Authentication failed' });
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to verify JWT token and authenticate requests
 */
export const authenticateJWT = async (
  // req: AuthenticatedRequest,
  // res: Response,
  // next: NextFunction
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
      res.status(401).json({ error: 'Authorization header missing or invalid' });
      // return;
    }

    const token = authHeader.split(' ')[1];

    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string };

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      // where: { googleId: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
      res.status(401).json({ error: 'User not found' });
      // return;
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      googleId: user.googleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // walletAddress: user.walletAddress,
      // profileImageUrl: user.profileImageUrl
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
      res.status(401).json({ error: 'Invalid token' });
      // return;
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
      res.status(401).json({ error: 'Token expired' });
      // return;
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to refresh JWT token
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      // return res.status(400).json({ error: 'Token is required' });
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    // Verify the existing token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Find the user in the database
    const user = await prisma.user.findUnique({
      // where: { id: decoded.userId },
      where: { googleId: decoded.userId },
    });

    if (!user) {
      // return res.status(401).json({ error: 'User not found' });
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Generate a new token
    const newToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // return res.status(200).json({
    res.status(200).json({
      message: 'Token refreshed successfully',
      token: newToken,
      userId: user.id,
    });
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // return res.status(401).json({ error: 'Invalid token' });
      res.status(401).json({ error: 'Invalid token' });
      return;
    } else if (error instanceof jwt.TokenExpiredError) {
      // return res.status(401).json({ error: 'Token expired, please login again' });
      res.status(401).json({ error: 'Token expired, please login again' });
      return;
    }
    
    console.error('Token refresh error:', error);
    // return res.status(500).json({ error: 'Token refresh failed' });
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

/**
 * Middleware to validate user exists
 */
export const validateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      // where: { id: req.user.id },
      where: { googleId: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('User validation error:', error);
    return res.status(500).json({ error: 'User validation failed' });
  }
};
