import { Router } from 'express';
import { CouponController } from '../controllers/couponController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import { authRateLimiter } from '../middlewares/rateLimiter';

const couponRoutes = Router();
const adminCouponRoutes = Router();
const couponController = new CouponController();

// Public routes (for e-commerce)
couponRoutes.get('/active', couponController.findActiveCoupons);
couponRoutes.post('/validate/:code', couponController.validateCoupon);
couponRoutes.get('/user/:userId', authMiddleware, couponController.getUserCoupons);

// Admin routes
adminCouponRoutes.get('/', authRateLimiter, authMiddleware, adminMiddleware, couponController.findAll);
adminCouponRoutes.post('/', authRateLimiter, authMiddleware, adminMiddleware, couponController.create);
adminCouponRoutes.get('/generate-code', authRateLimiter, authMiddleware, adminMiddleware, couponController.generateCode);
adminCouponRoutes.get('/:id', authRateLimiter, authMiddleware, adminMiddleware, couponController.findById);
adminCouponRoutes.get('/code/:code', authRateLimiter, authMiddleware, adminMiddleware, couponController.findByCode);
adminCouponRoutes.put('/:id', authRateLimiter, authMiddleware, adminMiddleware, couponController.update);
adminCouponRoutes.delete('/:id', authRateLimiter, authMiddleware, adminMiddleware, couponController.delete);
adminCouponRoutes.post('/:couponId/assign/:userId', authRateLimiter, authMiddleware, adminMiddleware, couponController.assignCouponToUser);

export { couponRoutes, adminCouponRoutes };