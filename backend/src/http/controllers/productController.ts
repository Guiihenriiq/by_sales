import { Request, Response } from 'express';
import { CreateProductUseCase } from '@/application/useCases/createProductUseCase';
import { ProductTypeOrmRepository } from '@/infra/database/typeorm/repositories/ProductTypeOrmRepository';

export class ProductController {
  async create(req: Request, res: Response) {
    try {
      const { 
        name, description, price, categoryId, stockQuantity, images, isActive,
        minStock, maxStock, costPrice, supplier, barcode, location, inventoryNotes
      } = req.body;
      
      const productRepository = new ProductTypeOrmRepository();
      const createProductUseCase = new CreateProductUseCase(productRepository);
      
      const product = await createProductUseCase.execute({
        name,
        description,
        price,
        categoryId,
        stockQuantity,
        images,
        isActive,
        minStock,
        maxStock,
        costPrice,
        supplier,
        barcode,
        location,
        inventoryNotes,
      });
      
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const productRepository = new ProductTypeOrmRepository();
      const products = await productRepository.findAll();
      
      return res.json(products);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const productRepository = new ProductTypeOrmRepository();
      const product = await productRepository.findById(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.json(product);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      
      const productRepository = new ProductTypeOrmRepository();
      const products = await productRepository.findByCategory(categoryId);
      
      return res.json(products);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const productRepository = new ProductTypeOrmRepository();
      const product = await productRepository.update(id, updateData);
      
      return res.json(product);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const productRepository = new ProductTypeOrmRepository();
      await productRepository.delete(id);
      
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { stockQuantity, inventoryNotes } = req.body;
      
      const productRepository = new ProductTypeOrmRepository();
      const product = await productRepository.update(id, {
        stockQuantity,
        inventoryNotes,
        lastInventoryDate: new Date()
      });
      
      return res.json(product);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}