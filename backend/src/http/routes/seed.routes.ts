import { Router } from 'express';
import { SeedController } from '../controllers/seedController';

const seedRoutes = Router();
const seedController = new SeedController();

seedRoutes.post('/admin', seedController.createAdminUser);

export { seedRoutes };