import { Product } from '../entities/product.entity';

export interface IProductRepository {
  create(product: Product): Promise<void>;
  findByName(name: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
}