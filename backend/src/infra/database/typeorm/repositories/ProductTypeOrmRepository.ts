import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Product } from '@/domain/entities/product.entity';
import { IProductRepository } from '@/domain/repositories/IProductRepository';

export class ProductTypeOrmRepository implements IProductRepository {
  private repository: Repository<Product>;

  constructor() {
    this.repository = AppDataSource.getRepository(Product);
  }

  async create(product: Product): Promise<Product> {
    return await this.repository.save(product);
  }

  async findById(id: string): Promise<Product | null> {
    return await this.repository.findOne({ 
      where: { id }, 
      relations: ['category'] 
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.repository.find({ 
      relations: ['category'],
      where: { isActive: true }
    });
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return await this.repository.find({ 
      where: { categoryId, isActive: true },
      relations: ['category']
    });
  }

  async update(id: string, productData: Partial<Product>): Promise<Product | null> {
    await this.repository.update(id, productData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}