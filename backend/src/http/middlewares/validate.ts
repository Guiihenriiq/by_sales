import { AppError } from '@/application/mappers/AppError';
import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodObject } from 'zod';

export const validate = (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      // Lançar um erro que será pego pelo nosso error handler global
      if (error instanceof ZodError) {
        throw new AppError(error.issues[0]?.message || 'Validation error', 422);
      }
      throw new AppError('Validation error', 422);
    }
  };