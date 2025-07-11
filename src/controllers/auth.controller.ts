import { Request, Response } from 'express';
import { createUser, findUserByEmail } from '../services/user.service';
import { generateToken } from '../config/token.jwt';

class AuthController {
  /**
   * Register a new user.
   * POST /api/auth/register
   */
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: 'Please enter all fields.' });
        return;
      }

      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'User with this email already exists.' });
        return;
      }

      const userId = await createUser({ email });
      const token = generateToken(userId);

      res.status(201).json({
        message: 'User registered successfully.',
        token,
        userId
      });
    } catch (error: any) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
  }

  /**
   * Log in a user.
   * POST /api/auth/login
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: 'Please enter all fields.' });
        return;
      }

      const user = await findUserByEmail(email);
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials.' });
        return;
      }

      const token = generateToken(user.id as string);

      res.status(200).json({
        message: 'Logged in successfully.',
        token,
        userId: user.id
      });
    } catch (error: any) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
  }
}

export default new AuthController();