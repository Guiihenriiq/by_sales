import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get('/', categoryController.findAll);
categoryRoutes.get('/:id', categoryController.findById);
categoryRoutes.post('/', authMiddleware, adminMiddleware, categoryController.create);

export { categoryRoutes };