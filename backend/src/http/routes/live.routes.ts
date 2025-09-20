import { Router } from 'express';
import { LiveController } from '../controllers/liveController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const liveRoutes = Router();
const liveController = new LiveController();

// Public routes
liveRoutes.get('/', liveController.findAll);
liveRoutes.get('/current', liveController.getCurrentLive);
liveRoutes.get('/:id', liveController.findById);

// Admin routes
liveRoutes.post('/', authMiddleware, adminMiddleware, liveController.create);
liveRoutes.patch('/:id/start', authMiddleware, adminMiddleware, liveController.startLive);
liveRoutes.patch('/:id/end', authMiddleware, adminMiddleware, liveController.endLive);
liveRoutes.patch('/:id/viewers', liveController.updateViewerCount);

export { liveRoutes };