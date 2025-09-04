import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const productRoutes = Router();
const productController = new ProductController();

productRoutes.get('/', productController.findAll);
productRoutes.get('/:id', productController.findById);
productRoutes.get('/category/:categoryId', productController.findByCategory);
productRoutes.post('/', authMiddleware, adminMiddleware, productController.create);

export { productRoutes };