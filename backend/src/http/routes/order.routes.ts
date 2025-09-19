import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const orderRoutes = Router();
const orderController = new OrderController();

orderRoutes.use(authMiddleware);

// User routes
orderRoutes.get('/', orderController.findByUserId);
orderRoutes.get('/:id', orderController.findById);
orderRoutes.post('/', orderController.create);
orderRoutes.put('/:id/status', orderController.updateStatus);

// Admin routes
const adminOrderRoutes = Router();
adminOrderRoutes.use(authMiddleware, adminMiddleware);
adminOrderRoutes.get('/orders', orderController.findAllOrders);
adminOrderRoutes.put('/orders/:id/status', orderController.adminUpdateStatus);

export { orderRoutes, adminOrderRoutes };