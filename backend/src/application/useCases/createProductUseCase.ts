import { Product } from '@/domain/entities/product.entity';
import { IProductRepository } from '@/domain/repositories/IProductRepository';

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  categoryId?: string;
  stockQuantity?: number;
  images?: string[];
  isActive?: boolean;
};

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const product = Product.create({
      name: input.name,
      description: input.description,
      price: input.price,
      categoryId: input.categoryId,
      stockQuantity: input.stockQuantity,
      images: input.images,
      isActive: input.isActive,
    });

    return await this.productRepository.create(product);
  }
}