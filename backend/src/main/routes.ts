import { Router } from 'express';
import { productRoutes } from 'src/http/routes/product.routes';

const routes = Router();

routes.use('/products', productRoutes);

routes.get('/health', (req, res) => {
  return res.status(200).json({ status: 'OK' });
});

export { routes };