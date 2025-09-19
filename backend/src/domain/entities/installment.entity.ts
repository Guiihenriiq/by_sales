import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';

export type InstallmentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

@Entity('installments')
export class Installment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: 'sale_id', type: 'uuid' })
  saleId!: string;

  @Column({ name: 'installment_number', type: 'int' })
  installmentNumber!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ name: 'due_date', type: 'date' })
  dueDate!: Date;

  @Column({ name: 'paid_date', type: 'date', nullable: true })
  paidDate?: Date;

  @Column({ name: 'paid_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  paidAmount?: number;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'overdue', 'cancelled'], default: 'pending' })
  status!: InstallmentStatus;

  @Column({ name: 'payment_method', type: 'varchar', length: 50, nullable: true })
  paymentMethod?: string;

  @Column({ name: 'transaction_id', type: 'varchar', length: 100, nullable: true })
  transactionId?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Sale, sale => sale.installments)
  @JoinColumn({ name: 'sale_id' })
  sale!: Sale;

  static create(props: {
    saleId: string;
    installmentNumber: number;
    amount: number;
    dueDate: Date;
  }): Installment {
    const installment = new Installment();
    
    Object.assign(installment, {
      ...props,
      status: 'pending' as InstallmentStatus
    });

    return installment;
  }

  markAsPaid(paidAmount: number, paymentMethod: string, transactionId?: string): void {
    this.status = 'paid';
    this.paidDate = new Date();
    this.paidAmount = paidAmount;
    this.paymentMethod = paymentMethod;
    this.transactionId = transactionId;
  }

  isOverdue(): boolean {
    return this.status === 'pending' && new Date() > this.dueDate;
  }
}