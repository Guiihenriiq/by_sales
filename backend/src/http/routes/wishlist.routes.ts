import { Router } from 'express';
import { WishlistController } from '../controllers/wishlistController';
import { authMiddleware } from '../middlewares/auth';
import { authRateLimiter } from '../middlewares/rateLimiter';

const wishlistRoutes = Router();
const wishlistController = new WishlistController();

// Test route without rate limiter
wishlistRoutes.get('/test', authMiddleware, (req, res) => {
  res.json({ message: 'Auth working', user: req.user });
});



// All wishlist routes require authentication
wishlistRoutes.get('/', authMiddleware, wishlistController.getUserWishlist);
wishlistRoutes.post('/', authMiddleware, wishlistController.addToWishlist);
wishlistRoutes.delete('/:productId', authMiddleware, wishlistController.removeFromWishlist);
wishlistRoutes.get('/check/:productId', authMiddleware, wishlistController.checkWishlistStatus);

export { wishlistRoutes };