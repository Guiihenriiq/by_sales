import { Request, Response } from 'express';
import { Wishlist } from '@/domain/entities/wishlist.entity';
import { WishlistTypeOrmRepository } from '@/infra/database/typeorm/repositories/WishlistTypeOrmRepository';

export class WishlistController {
  async addToWishlist(req: Request, res: Response) {
    try {
      const { productId } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const wishlistRepository = new WishlistTypeOrmRepository();
      
      // Check if already exists
      const existing = await wishlistRepository.findByUserAndProduct(userId, productId);
      if (existing) {
        return res.status(400).json({ error: 'Product already in wishlist' });
      }

      const wishlist = Wishlist.create(userId, productId);
      const savedWishlist = await wishlistRepository.create(wishlist);
      
      return res.status(201).json(savedWishlist);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async removeFromWishlist(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const wishlistRepository = new WishlistTypeOrmRepository();
      await wishlistRepository.delete(userId, productId);
      
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUserWishlist(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const wishlistRepository = new WishlistTypeOrmRepository();
      const wishlist = await wishlistRepository.findByUserId(userId);
      
      return res.json(wishlist);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async checkWishlistStatus(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const wishlistRepository = new WishlistTypeOrmRepository();
      const wishlistItem = await wishlistRepository.findByUserAndProduct(userId, productId);
      
      return res.json({ inWishlist: !!wishlistItem });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}