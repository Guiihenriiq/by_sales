import { Request, Response } from 'express';
import { UserTypeOrmRepository } from '@/infra/database/typeorm/repositories/UserTypeOrmRepository';

export class AdminController {
  async getCustomers(req: Request, res: Response) {
    try {
      const userRole = req.user?.role;
      
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      // Buscar clientes reais do banco de dados
      const userRepository = new UserTypeOrmRepository();
      const allUsers = await userRepository.findAll();
      
      // Filtrar apenas clientes (não admins)
      const customers = allUsers.filter(user => user.role === 'customer');
      
      return res.json(customers);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async banCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRole = req.user?.role;
      
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const userRepository = new UserTypeOrmRepository();
      const user = await userRepository.findById(id);
      
      if (!user || user.role !== 'customer') {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Banir usuário definindo emailVerified como false
      user.emailVerified = false;
      user.banned = true;
      
      await userRepository.update(user);
      
      return res.json({ 
        message: 'Customer banned successfully',
        user
      });
    } catch (error) {
      console.error('Erro ao banir cliente:', error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async unbanCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRole = req.user?.role;
      
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const userRepository = new UserTypeOrmRepository();
      const user = await userRepository.findById(id);
      
      if (!user || user.role !== 'customer') {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Desbanir usuário
      user.emailVerified = true;
      user.banned = false;
      
      await userRepository.update(user);
      
      return res.json({ 
        message: 'Customer unbanned successfully',
        user
      });
    } catch (error) {
      console.error('Erro ao desbanir cliente:', error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }


}