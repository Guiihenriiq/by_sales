import { Product } from '@/domain/entities/product.entity';
import { IProductRepository } from '@/domain/repositories/IProductRepository';
import { AppError } from '../mappers/AppError';

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
};

// O retorno pode ser void ou a entidade criada, dependendo da sua necessidade
type CreateProductOutput = Product;

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    const productAlreadyExists = await this.productRepository.findByName(input.name);

    if (productAlreadyExists) {
      throw new AppError('Product with this name already exists.');
    }

    const product = Product.create({
      name: input.name,
      description: input.description,
      price: input.price,
    });

    await this.productRepository.create(product);

    return product;
  }
}