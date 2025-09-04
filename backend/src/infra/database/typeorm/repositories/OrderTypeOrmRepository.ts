import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Order } from '@/domain/entities/order.entity';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';

export class OrderTypeOrmRepository implements IOrderRepository {
  private repository: Repository<Order>;

  constructor() {
    this.repository = AppDataSource.getRepository(Order);
  }

  async create(order: Order): Promise<Order> {
    return await this.repository.save(order);
  }

  async findById(id: string): Promise<Order | null> {
    return await this.repository.findOne({ 
      where: { id }, 
      relations: ['user', 'items', 'items.product'] 
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return await this.repository.find({ 
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async findAll(): Promise<Order[]> {
    return await this.repository.find({ 
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: string, orderData: Partial<Order>): Promise<Order | null> {
    await this.repository.update(id, orderData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}