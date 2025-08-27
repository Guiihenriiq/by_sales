import { Request, Response } from 'express';
import { ProductTypeOrmRepository } from '@/infra/database/typeorm/repositories/ProductTypeOrmRepository';
import { CreateProductUseCase } from '@/application/useCases/createProductUseCase';

export class CreateProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description, price } = request.body;

    // A injeção de dependência pode ser melhorada com um container (ex: Tsyringe)
    const productRepository = new ProductTypeOrmRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const product = await createProductUseCase.execute({ name, description, price });

    return response.status(201).json(product);
  }
}