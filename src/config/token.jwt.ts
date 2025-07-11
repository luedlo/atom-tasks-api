import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Generates a JWT token for a given user ID.
 * @param userId The ID of the user.
 * @returns A signed JWT string.
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
};

/**
 * Verifies a JWT token.
 * @param token The JWT string to verify.
 * @returns The decoded payload if valid, null otherwise.
 */
export const verifyToken = (token: string): { id: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      console.error('JWT verification failed:', error.message);
    } else {
      console.error('JWT verification failed:', error);
    }
    return null;
  }
};