import { Order } from '../entities/order.entity';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  update(id: string, order: Partial<Order>): Promise<Order | null>;
  delete(id: string): Promise<void>;
}