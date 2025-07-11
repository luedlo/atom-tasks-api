import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import taskRoutes from './routes/task.route';
import authRoutes from './routes/auth.route';
import { protect } from './middleware/auth.middleware';
import './config/db.firebase';

dotenv.config();

class App {
  public app: Application;
  public port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware(): void {
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/tasks', protect, taskRoutes);

    this.app.get('/', (_, res) => {
      res.send(process.env.API_NAME + ' is running!');
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const app = new App(PORT);
app.listen();