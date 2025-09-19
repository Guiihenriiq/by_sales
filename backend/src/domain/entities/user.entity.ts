import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Cart } from './cart.entity';
import { Sale } from './sale.entity';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'customer';

type CreateUserProps = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  emailVerificationToken?: string;
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

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ name: 'email_verification_token', type: 'varchar', length: 255, nullable: true })
  emailVerificationToken?: string;

  @Column({ type: 'boolean', default: false })
  banned!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Order, order => order.user)
  orders!: Order[];

  @OneToMany(() => Cart, cart => cart.user)
  cartItems!: Cart[];

  @OneToMany(() => Sale, sale => sale.user)
  sales!: Sale[];

  private constructor() { }

  static async create(props: CreateUserProps): Promise<User> {
    const user = new User();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(props.email)) {
      throw new Error('Invalid email format.');
    }

    if (props.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const hashedPassword = await bcrypt.hash(props.password, 12);

    Object.assign(user, {
      name: props.name.trim(),
      email: props.email.toLowerCase().trim(),
      password: hashedPassword,
      role: props.role || 'customer',
      phone: props.phone?.trim(),
      address: props.address?.trim(),
      emailVerified: false,
      emailVerificationToken: props.emailVerificationToken,
    });

    return user;
  }

  async verifyEmail(): Promise<void> {
    this.emailVerified = true;
    this.emailVerificationToken = null;
  }

  generateVerificationToken(): string {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.emailVerificationToken = token;
    return token;
  }
}