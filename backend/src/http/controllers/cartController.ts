import { Request, Response } from 'express';
import { AddToCartUseCase } from '@/application/useCases/addToCartUseCase';
import { CartTypeOrmRepository } from '@/infra/database/typeorm/repositories/CartTypeOrmRepository';

export class CartController {
  async addToCart(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
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
      
      const cartRepository = new CartTypeOrmRepository();
      await cartRepository.delete(id);
      
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}