import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  role: z.enum(['admin', 'customer']).optional(),
  phone: z.string()
    .min(10, 'Phone must be at least 10 characters')
    .max(20, 'Phone must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  address: z.string()
    .max(500, 'Address must be less than 500 characters')
    .optional()
    .or(z.literal(''))
});

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, 'Password is required')
});