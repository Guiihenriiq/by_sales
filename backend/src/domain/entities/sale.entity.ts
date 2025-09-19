import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Installment } from './installment.entity';

export type SaleStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'cash';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ name: 'installments_count', type: 'int', default: 1 })
  installmentsCount!: number;

  @Column({ name: 'payment_method', type: 'enum', enum: ['credit_card', 'debit_card', 'pix', 'boleto', 'cash'] })
  paymentMethod!: PaymentMethod;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' })
  status!: SaleStatus;

  @Column({ name: 'billing_code', type: 'varchar', length: 50, unique: true })
  billingCode!: string;

  @Column({ name: 'shipping_address', type: 'text' })
  shippingAddress!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.sales)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Installment, installment => installment.sale, { cascade: true })
  installments!: Installment[];

  static create(props: {
    userId: string;
    totalAmount: number;
    installmentsCount: number;
    paymentMethod: PaymentMethod;
    shippingAddress: string;
    notes?: string;
  }): Sale {
    const sale = new Sale();
    
    Object.assign(sale, {
      ...props,
      status: 'pending' as SaleStatus,
      billingCode: Sale.generateBillingCode()
    });

    return sale;
  }

  private static generateBillingCode(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BS${timestamp.slice(-6)}${random}`;
  }

  calculateInstallmentAmount(): number {
    return this.totalAmount / this.installmentsCount;
  }
}