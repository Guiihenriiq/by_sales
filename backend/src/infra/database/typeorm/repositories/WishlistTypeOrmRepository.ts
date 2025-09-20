import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Wishlist } from '@/domain/entities/wishlist.entity';
import { IWishlistRepository } from '@/domain/repositories/IWishlistRepository';

export class WishlistTypeOrmRepository implements IWishlistRepository {
  private repository: Repository<Wishlist>;

  constructor() {
    this.repository = AppDataSource.getRepository(Wishlist);
  }

  async create(wishlist: Wishlist): Promise<Wishlist> {
    return await this.repository.save(wishlist);
  }

  async findByUserId(userId: string): Promise<Wishlist[]> {
    return await this.repository.find({
      where: { userId },
      relations: ['product', 'product.category'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<Wishlist | null> {
    return await this.repository.findOne({
      where: { userId, productId }
    });
  }

  async delete(userId: string, productId: string): Promise<void> {
    await this.repository.delete({ userId, productId });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}