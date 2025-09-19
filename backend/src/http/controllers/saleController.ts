import { Request, Response } from 'express';
import { SaleTypeOrmRepository } from '@/infra/database/typeorm/repositories/SaleTypeOrmRepository';
import { Sale } from '@/domain/entities/sale.entity';
import { Installment } from '@/domain/entities/installment.entity';
import { z } from 'zod';

const createSaleSchema = z.object({
  totalAmount: z.number().positive(),
  installmentsCount: z.number().int().min(1).max(12),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'pix', 'boleto', 'cash']),
  shippingAddress: z.string().min(10),
  notes: z.string().optional()
});

export class SaleController {
  async create(req: Request, res: Response) {
    try {
      const validatedData = createSaleSchema.parse(req.body);
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const saleRepository = new SaleTypeOrmRepository();
      
      // Criar venda
      const sale = Sale.create({
        userId,
        ...validatedData
      });

      const savedSale = await saleRepository.create(sale);

      // Criar parcelas
      const installmentAmount = savedSale.calculateInstallmentAmount();
      const installments: Installment[] = [];

      for (let i = 1; i <= savedSale.installmentsCount; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);

        const installment = Installment.create({
          saleId: savedSale.id,
          installmentNumber: i,
          amount: installmentAmount,
          dueDate
        });

        installments.push(installment);
      }

      savedSale.installments = installments;
      await saleRepository.update(savedSale);

      return res.status(201).json({
        sale: savedSale,
        message: 'Venda criada com sucesso!'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.errors.map(e => e.message)
        });
      }
      console.error('Erro ao criar venda:', error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findByUser(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const saleRepository = new SaleTypeOrmRepository();
      const sales = await saleRepository.findByUserId(userId);

      return res.json(sales);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const saleRepository = new SaleTypeOrmRepository();
      const sale = await saleRepository.findById(id);

      if (!sale || sale.userId !== userId) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      return res.json(sale);
    } catch (error) {
      console.error('Erro ao buscar venda:', error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  // Admin methods
  async findAll(req: Request, res: Response) {
    try {
      const userRole = req.user?.role;
      
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const saleRepository = new SaleTypeOrmRepository();
      const sales = await saleRepository.findAll();

      return res.json(sales);
    } catch (error) {
      console.error('Erro ao buscar todas as vendas:', error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userRole = req.user?.role;
      
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const saleRepository = new SaleTypeOrmRepository();
      const sale = await saleRepository.findById(id);

      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      sale.status = status;
      await saleRepository.update(sale);

      return res.json({
        sale,
        message: 'Status da venda atualizado com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao atualizar status da venda:', error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}