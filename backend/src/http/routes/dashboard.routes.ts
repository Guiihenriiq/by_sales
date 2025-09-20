import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.use(authMiddleware, adminMiddleware);

dashboardRoutes.get('/stats', dashboardController.getStats);

export { dashboardRoutes };