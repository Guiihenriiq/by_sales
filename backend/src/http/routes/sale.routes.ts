import { Router } from 'express';
import { SaleController } from '../controllers/saleController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const saleRoutes = Router();
const saleController = new SaleController();

saleRoutes.use(authMiddleware);

// User routes
saleRoutes.get('/', saleController.findByUser);
saleRoutes.get('/:id', saleController.findById);
saleRoutes.post('/', saleController.create);

// Admin routes
const adminSaleRoutes = Router();
adminSaleRoutes.use(authMiddleware, adminMiddleware);
adminSaleRoutes.get('/sales', saleController.findAll);
adminSaleRoutes.put('/sales/:id/status', saleController.updateStatus);

export { saleRoutes, adminSaleRoutes };