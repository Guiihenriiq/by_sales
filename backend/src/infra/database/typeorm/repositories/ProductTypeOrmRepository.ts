import { IProductRepository } from '@/domain/repositories/IProductRepository';
import { Product } from '@/domain/entities/product.entity';
import { AppDataSource } from '../../data-source';
import { Repository } from 'typeorm';
import { ProductSchema } from '../schemas/ProductSchema';

export class ProductTypeOrmRepository implements IProductRepository {
  private repository: Repository<Product>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProductSchema);
  }

  async create(product: Product): Promise<void> {
    await this.repository.save(product);
  }

  async findByName(name: string): Promise<Product | null> {
    const product = await this.repository.findOneBy({ name: name });
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.repository.findOneBy({ id });
    return product;
  }
}