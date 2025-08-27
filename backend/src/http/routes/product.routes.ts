import { Router } from 'express';
import { createProductSchema } from '../validators/create-product.validator';
import { CreateProductController } from '../controllers/createproductController';
import { validate } from '../middlewares/validate';

const productRoutes = Router();

const createProductController = new CreateProductController();

productRoutes.post(
  '/',
  validate(createProductSchema), // Middleware de validação
  createProductController.handle
);

export { productRoutes };