import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.use(authMiddleware, adminMiddleware);

adminRoutes.get('/customers', adminController.getCustomers);
adminRoutes.put('/customers/:id/ban', adminController.banCustomer);
adminRoutes.put('/customers/:id/unban', adminController.unbanCustomer);

export { adminRoutes };