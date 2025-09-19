import { Request, Response } from 'express';
import { AddToCartUseCase } from '@/application/useCases/addToCartUseCase';
import { CartTypeOrmRepository } from '@/infra/database/typeorm/repositories/CartTypeOrmRepository';
import { ProductTypeOrmRepository } from '@/infra/database/typeorm/repositories/ProductTypeOrmRepository';

export class CartController {
  async addToCart(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const productRepository = new ProductTypeOrmRepository();
      const product = await productRepository.findById(productId);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      if (product.stockQuantity < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      
      const cartRepository = new CartTypeOrmRepository();
      const addToCartUseCase = new AddToCartUseCase(cartRepository);
      
      const cartItem = await addToCartUseCase.execute({
        userId,
        productId,
        quantity,
      });
      
      return res.status(201).json(cartItem);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const cartRepository = new CartTypeOrmRepository();
      const cartItems = await cartRepository.findByUserId(userId);
      
      return res.json(cartItems);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async removeFromCart(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const cartRepository = new CartTypeOrmRepository();
      const cartItem = await cartRepository.findById(id);
      
      if (!cartItem || cartItem.userId !== userId) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      await cartRepository.delete(id);
      
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateQuantity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be greater than zero' });
      }
      
      const cartRepository = new CartTypeOrmRepository();
      const productRepository = new ProductTypeOrmRepository();
      
      const cartItem = await cartRepository.findById(id);
      if (!cartItem || cartItem.userId !== userId) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      const product = await productRepository.findById(cartItem.productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      if (product.stockQuantity < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      
      cartItem.quantity = quantity;
      const updatedItem = await cartRepository.save(cartItem);
      
      return res.json(updatedItem);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}