import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { AppDataSource } from '@/infra/database/data-source';
import { routes } from './routes';
import { sanitizeInput } from '@/http/middlewares/sanitizer';
import { generalRateLimiter } from '@/http/middlewares/rateLimiter';
import { LiveStreamingServer } from '@/infra/websocket/liveStreamingServer';

const app = express();
const port = process.env.PORT || 3334;

// Security middlewares
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiter apenas para rotas específicas, não global
// app.use(generalRateLimiter);

app.use(cors({
  origin: ['http://localhost:9000', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']
}));

app.use(express.json({ limit: '10mb' }));
app.use(sanitizeInput);
app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

// Middleware de tratamento de erros global
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(err);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully!');
    
    const server = createServer(app);
    new LiveStreamingServer(server);
    
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`WebSocket server is running on ws://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));