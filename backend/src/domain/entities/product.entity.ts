import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { Cart } from './cart.entity';

type CreateProductProps = {
  name: string;
  description: string;
  price: number;
  categoryId?: string;
  stockQuantity?: number;
  images?: string[];
  isActive?: boolean;
  minStock?: number;
  maxStock?: number;
  costPrice?: number;
  supplier?: string;
  barcode?: string;
  location?: string;
  lastInventoryDate?: Date;
  inventoryNotes?: string;
};

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId?: string;

  @Column({ name: 'stock_quantity', type: 'integer', default: 0 })
  stockQuantity!: number;

  @Column({ type: 'text', array: true, default: '{}' })
  images!: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'min_stock', type: 'integer', default: 0 })
  minStock!: number;

  @Column({ name: 'max_stock', type: 'integer', default: 1000 })
  maxStock!: number;

  @Column({ name: 'cost_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
  costPrice!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  supplier?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ name: 'last_inventory_date', type: 'timestamp', nullable: true })
  lastInventoryDate?: Date;

  @Column({ name: 'inventory_notes', type: 'text', nullable: true })
  inventoryNotes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems!: OrderItem[];

  @OneToMany(() => Cart, cart => cart.product)
  cartItems!: Cart[];

  private constructor() { }

  static create(props: CreateProductProps): Product {
    const product = new Product();

    if (props.price <= 0) {
      throw new Error('Price must be greater than zero.');
    }

    Object.assign(product, {
      name: props.name,
      description: props.description,
      price: props.price,
      categoryId: props.categoryId,
      stockQuantity: props.stockQuantity || 0,
      images: props.images || [],
      isActive: props.isActive !== undefined ? props.isActive : true,
      minStock: props.minStock || 0,
      maxStock: props.maxStock || 1000,
      costPrice: props.costPrice || 0,
      supplier: props.supplier,
      barcode: props.barcode,
      location: props.location,
      lastInventoryDate: props.lastInventoryDate,
      inventoryNotes: props.inventoryNotes,
    });

    return product;
  }
}