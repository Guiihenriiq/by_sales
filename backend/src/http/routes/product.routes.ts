import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import { authRateLimiter } from '../middlewares/rateLimiter';

const productRoutes = Router();
const productController = new ProductController();

// Rotas públicas sem rate limit
productRoutes.get('/', productController.findAll);
productRoutes.get('/:id', productController.findById);
productRoutes.get('/category/:categoryId', productController.findByCategory);

// Rotas protegidas com rate limit
productRoutes.post('/', authRateLimiter, authMiddleware, adminMiddleware, productController.create);

export { productRoutes };