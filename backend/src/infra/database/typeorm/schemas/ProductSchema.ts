import { EntitySchema } from 'typeorm';
import { Product } from '@/domain/entities/product.entity';

export const ProductSchema = new EntitySchema<Product>({
  name: 'Product',
  tableName: 'products',
  target: Product,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
    },
    name: {
      type: 'varchar',
    },
    description: {
      type: 'text',
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true,
    },
  },
});