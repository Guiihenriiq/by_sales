import { Category } from '@/domain/entities/category.entity';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';

interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(data: CreateCategoryRequest): Promise<Category> {
    const category = Category.create(data);
    return await this.categoryRepository.create(category);
  }
}