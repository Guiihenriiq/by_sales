import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Sale } from '@/domain/entities/sale.entity';
import { ISaleRepository } from '@/domain/repositories/ISaleRepository';

export class SaleTypeOrmRepository implements ISaleRepository {
  private repository: Repository<Sale>;

  constructor() {
    this.repository = AppDataSource.getRepository(Sale);
  }

  async create(sale: Sale): Promise<Sale> {
    return await this.repository.save(sale);
  }

  async findById(id: string): Promise<Sale | null> {
    return await this.repository.findOne({ 
      where: { id },
      relations: ['installments', 'user']
    });
  }

  async findByUserId(userId: string): Promise<Sale[]> {
    return await this.repository.find({ 
      where: { userId },
      relations: ['installments'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByBillingCode(billingCode: string): Promise<Sale | null> {
    return await this.repository.findOne({ 
      where: { billingCode },
      relations: ['installments', 'user']
    });
  }

  async findAll(): Promise<Sale[]> {
    return await this.repository.find({
      relations: ['installments', 'user'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(sale: Sale): Promise<Sale> {
    return await this.repository.save(sale);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}