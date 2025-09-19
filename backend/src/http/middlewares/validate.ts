import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: error.issues[0]?.message || 'Validation error',
          details: error.issues
        });
      }
      return res.status(400).json({ error: 'Validation error' });
    }
  };