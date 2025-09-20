import { Router } from 'express';
import { productRoutes } from 'src/http/routes/product.routes';
import { authRoutes } from 'src/http/routes/auth.routes';
import { categoryRoutes } from 'src/http/routes/category.routes';
import { cartRoutes } from 'src/http/routes/cart.routes';
import { orderRoutes, adminOrderRoutes } from 'src/http/routes/order.routes';
import { dashboardRoutes } from 'src/http/routes/dashboard.routes';
import { adminRoutes } from 'src/http/routes/admin.routes';
import { saleRoutes, adminSaleRoutes } from 'src/http/routes/sale.routes';
import { offerRoutes, adminOfferRoutes } from 'src/http/routes/offer.routes';
import { couponRoutes, adminCouponRoutes } from 'src/http/routes/coupon.routes';
import { wishlistRoutes } from 'src/http/routes/wishlist.routes';
import { liveRoutes } from 'src/http/routes/live.routes';
import { seedRoutes } from 'src/http/routes/seed.routes';
import { DebugController } from 'src/http/controllers/debugController';
import { TestController } from '../http/controllers/testController';

const routes = Router();
const testController = new TestController();

routes.use('/auth', authRoutes);
routes.use('/products', productRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/cart', cartRoutes);
routes.use('/orders', orderRoutes);
routes.use('/admin', adminOrderRoutes);
routes.use('/dashboard', dashboardRoutes);
routes.use('/admin/dashboard', dashboardRoutes);
routes.use('/admin', adminRoutes);
routes.use('/sales', saleRoutes);
routes.use('/admin', adminSaleRoutes);
routes.use('/offers', offerRoutes);
routes.use('/admin/offers', adminOfferRoutes);
routes.use('/coupons', couponRoutes);
routes.use('/admin/coupons', adminCouponRoutes);
routes.use('/wishlist', wishlistRoutes);
routes.use('/lives', liveRoutes);
routes.use('/seed', seedRoutes);

// Debug route
const debugController = new DebugController();
routes.post('/debug/reset-password', debugController.resetUserPassword);

routes.get('/health', (req, res) => {
  return res.status(200).json({ status: 'OK' });
});

// Rota temporária para verificar email
routes.post('/test/verify-email/:email', testController.verifyUserByEmail);

export { routes };