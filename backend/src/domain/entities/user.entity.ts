import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Cart } from './cart.entity';

export type UserRole = 'admin' | 'customer';

type CreateUserProps = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  address?: string;
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'enum', enum: ['admin', 'customer'], default: 'customer' })
  role!: UserRole;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Order, order => order.user)
  orders!: Order[];

  @OneToMany(() => Cart, cart => cart.user)
  cartItems!: Cart[];

  private constructor() { }

  static create(props: CreateUserProps): User {
    const user = new User();
    
    if (!props.email.includes('@')) {
      throw new Error('Invalid email format.');
    }

    Object.assign(user, {
      name: props.name,
      email: props.email,
      password: props.password,
      role: props.role || 'customer',
      phone: props.phone,
      address: props.address,
    });

    return user;
  }
}