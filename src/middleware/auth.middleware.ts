import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/token.jwt';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Middleware to protect routes with JWT authentication.
 * Checks for a valid token in the Authorization header.
 */
export const protect = (req: Request, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied.' });
    return;
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Token is not valid.' });
      return;
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Not authorized, token failed.' });
  }
};