import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Product } from '@/domain/entities/product.entity';
import { User } from '@/domain/entities/user.entity';
import { Category } from '@/domain/entities/category.entity';
import { Order } from '@/domain/entities/order.entity';
import { OrderItem } from '@/domain/entities/order-item.entity';
import { Cart } from '@/domain/entities/cart.entity';
import { Sale } from '@/domain/entities/sale.entity';
import { Installment } from '@/domain/entities/installment.entity';
import { Offer } from '@/domain/entities/offer.entity';
import { OfferProduct } from '@/domain/entities/offer-product.entity';
import { Coupon } from '@/domain/entities/coupon.entity';
import { UserCoupon } from '@/domain/entities/user-coupon.entity';
import { Wishlist } from '@/domain/entities/wishlist.entity';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Product, User, Category, Order, OrderItem, Cart, Sale, Installment, Offer, OfferProduct, Coupon, UserCoupon, Wishlist],
  migrations: [__dirname + '/typeorm/migrations/*.{js,ts}'],
};

export const AppDataSource = new DataSource(dataSourceOptions);