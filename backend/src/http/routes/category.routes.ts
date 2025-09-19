import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import { authRateLimiter } from '../middlewares/rateLimiter';

const categoryRoutes = Router();
const categoryController = new CategoryController();

// Rotas públicas sem rate limit
categoryRoutes.get('/', categoryController.findAll);
categoryRoutes.get('/:id', categoryController.findById);

// Rotas protegidas com rate limit
categoryRoutes.post('/', authRateLimiter, authMiddleware, adminMiddleware, categoryController.create);

export { categoryRoutes };