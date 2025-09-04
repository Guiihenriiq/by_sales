import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authMiddleware } from '../middlewares/auth';

const cartRoutes = Router();
const cartController = new CartController();

cartRoutes.use(authMiddleware);

cartRoutes.get('/', cartController.getCart);
cartRoutes.post('/', cartController.addToCart);
cartRoutes.delete('/:id', cartController.removeFromCart);

export { cartRoutes };