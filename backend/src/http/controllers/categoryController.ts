import { Request, Response } from 'express';
import { CreateCategoryUseCase } from '@/application/useCases/createCategoryUseCase';
import { CategoryTypeOrmRepository } from '@/infra/database/typeorm/repositories/CategoryTypeOrmRepository';

export class CategoryController {
  async create(req: Request, res: Response) {
    try {
      const { name, description, imageUrl } = req.body;
      
      const categoryRepository = new CategoryTypeOrmRepository();
      const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
      
      const category = await createCategoryUseCase.execute({
        name,
        description,
        imageUrl,
      });
      
      return res.status(201).json(category);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const categoryRepository = new CategoryTypeOrmRepository();
      const categories = await categoryRepository.findAll();
      
      return res.json(categories);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const categoryRepository = new CategoryTypeOrmRepository();
      const category = await categoryRepository.findById(id);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      return res.json(category);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}