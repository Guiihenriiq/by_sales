import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { AppDataSource } from '@/infra/database/data-source';
import { routes } from './routes';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors({
  origin: ['http://localhost:9000', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
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
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));