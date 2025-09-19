import { Sale } from '../entities/sale.entity';

export interface ISaleRepository {
  create(sale: Sale): Promise<Sale>;
  findById(id: string): Promise<Sale | null>;
  findByUserId(userId: string): Promise<Sale[]>;
  findByBillingCode(billingCode: string): Promise<Sale | null>;
  findAll(): Promise<Sale[]>;
  update(sale: Sale): Promise<Sale>;
  delete(id: string): Promise<void>;
}