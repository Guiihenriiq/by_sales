import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long.'),
    description: z.string().min(10, 'Description is too short.'),
    price: z.number().positive('Price must be a positive number.'),
  }),
});