import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

type CreateOrderItemProps = {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
};

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @Column({ type: 'integer' })
  quantity!: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;

  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => Product, product => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  private constructor() { }

  static create(props: CreateOrderItemProps): OrderItem {
    const orderItem = new OrderItem();

    if (props.quantity <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }

    if (props.unitPrice <= 0) {
      throw new Error('Unit price must be greater than zero.');
    }

    const totalPrice = props.quantity * props.unitPrice;

    Object.assign(orderItem, {
      orderId: props.orderId,
      productId: props.productId,
      quantity: props.quantity,
      unitPrice: props.unitPrice,
      totalPrice,
    });

    return orderItem;
  }
}