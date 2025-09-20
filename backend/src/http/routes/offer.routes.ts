import { Router } from 'express';
import { OfferController } from '../controllers/offerController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import { authRateLimiter } from '../middlewares/rateLimiter';

const offerRoutes = Router();
const adminOfferRoutes = Router();
const offerController = new OfferController();

// Public routes
offerRoutes.get('/active', offerController.findActiveOffers);
offerRoutes.get('/product/:productId', offerController.findByProductId);
offerRoutes.get('/:id', offerController.findById);

// Admin routes
adminOfferRoutes.get('/', authRateLimiter, authMiddleware, adminMiddleware, offerController.findAll);
adminOfferRoutes.post('/', authRateLimiter, authMiddleware, adminMiddleware, offerController.create);
adminOfferRoutes.put('/:id', authRateLimiter, authMiddleware, adminMiddleware, offerController.update);
adminOfferRoutes.delete('/:id', authRateLimiter, authMiddleware, adminMiddleware, offerController.delete);
adminOfferRoutes.post('/:offerId/products/:productId', authRateLimiter, authMiddleware, adminMiddleware, offerController.addProductToOffer);
adminOfferRoutes.delete('/:offerId/products/:productId', authRateLimiter, authMiddleware, adminMiddleware, offerController.removeProductFromOffer);

export { offerRoutes, adminOfferRoutes };