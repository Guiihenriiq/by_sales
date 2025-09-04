import { Router } from 'express';
import { productRoutes } from 'src/http/routes/product.routes';
import { authRoutes } from 'src/http/routes/auth.routes';
import { categoryRoutes } from 'src/http/routes/category.routes';
import { cartRoutes } from 'src/http/routes/cart.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/products', productRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/cart', cartRoutes);

routes.get('/health', (req, res) => {
  return res.status(200).json({ status: 'OK' });
});

export { routes };