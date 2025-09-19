import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { TestAuthController } from '../controllers/testAuthController';
import { authRateLimiter } from '../middlewares/rateLimiter';

const authRoutes = Router();
const authController = new AuthController();
const testAuthController = new TestAuthController();

authRoutes.post('/login', testAuthController.login);
authRoutes.post('/register', authRateLimiter, authController.register);
authRoutes.get('/verify-email', authRateLimiter, authController.verifyEmail);

export { authRoutes };