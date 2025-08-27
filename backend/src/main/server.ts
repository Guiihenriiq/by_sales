import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@/infra/database/data-source';
import { routes } from './routes';
import { AppError } from '@/application/mappers/AppError';

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use('/api', routes); // Prefixo para todas as rotas da API

// Middleware de tratamento de erros global
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

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