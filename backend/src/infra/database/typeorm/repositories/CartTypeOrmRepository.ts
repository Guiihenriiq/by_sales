import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Cart } from '@/domain/entities/cart.entity';
import { ICartRepository } from '@/domain/repositories/ICartRepository';

export class CartTypeOrmRepository implements ICartRepository {
  private repository: Repository<Cart>;

  constructor() {
    this.repository = AppDataSource.getRepository(Cart);
  }

  async create(cart: Cart): Promise<Cart> {
    return await this.repository.save(cart);
  }

  async findByUserId(userId: string): Promise<Cart[]> {
    return await this.repository.find({ 
      where: { userId },
      relations: ['product', 'product.category']
    });
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<Cart | null> {
    return await this.repository.findOne({ 
      where: { userId, productId },
      relations: ['product']
    });
  }

  async update(id: string, cartData: Partial<Cart>): Promise<Cart | null> {
    await this.repository.update(id, cartData);
    return await this.repository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }

  async findById(id: string): Promise<Cart | null> {
    return await this.repository.findOne({ 
      where: { id },
      relations: ['product']
    });
  }

  async save(cart: Cart): Promise<Cart> {
    return await this.repository.save(cart);
  }
}