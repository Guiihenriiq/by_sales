import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Category } from '@/domain/entities/category.entity';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';

export class CategoryTypeOrmRepository implements ICategoryRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = AppDataSource.getRepository(Category);
  }

  async create(category: Category): Promise<Category> {
    return await this.repository.save(category);
  }

  async findById(id: string): Promise<Category | null> {
    return await this.repository.findOne({ where: { id }, relations: ['products'] });
  }

  async findAll(): Promise<Category[]> {
    return await this.repository.find({ relations: ['products'] });
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category | null> {
    await this.repository.update(id, categoryData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}