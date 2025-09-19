import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function createRateLimiter(windowMs: number, maxRequests: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    
    // Clean expired entries
    Object.keys(store).forEach(k => {
      if (store[k].resetTime < now) {
        delete store[k];
      }
    });
    
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }
    
    if (store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }
    
    store[key].count++;
    
    if (store[key].count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000)
      });
    }
    
    next();
  };
}

// Rate limiters específicos
export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 50); // 50 tentativas por 15 minutos
export const generalRateLimiter = createRateLimiter(1 * 60 * 1000, 500); // 500 requests por 1 minuto