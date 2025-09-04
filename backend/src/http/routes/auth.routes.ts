import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register);

export { authRoutes };