import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

type CreateOrderProps = {
  userId: string;
  totalAmount: number;
  shippingAddress: string;
  status?: OrderStatus;
};

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'enum', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' })
  status!: OrderStatus;

  @Column({ name: 'shipping_address', type: 'text' })
  shippingAddress!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items!: OrderItem[];

  private constructor() { }

  static create(props: CreateOrderProps): Order {
    const order = new Order();

    if (props.totalAmount <= 0) {
      throw new Error('Total amount must be greater than zero.');
    }

    Object.assign(order, {
      userId: props.userId,
      totalAmount: props.totalAmount,
      shippingAddress: props.shippingAddress,
      status: props.status || 'pending',
    });

    return order;
  }
}