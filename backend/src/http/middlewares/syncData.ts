import { Request, Response, NextFunction } from 'express';
import { UserTypeOrmRepository } from '@/infra/database/typeorm/repositories/UserTypeOrmRepository';
import { AdminController } from '../controllers/adminController';
import { DashboardController } from '../controllers/dashboardController';

export const syncDataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Executar a operação original
    const originalSend = res.send;
    
    res.send = function(data) {
      // Após a resposta ser enviada, sincronizar dados
      setImmediate(async () => {
        try {
          const userRepository = new UserTypeOrmRepository();
          const users = await userRepository.findAll();
          
          // Sincronizar com controllers
          AdminController.syncUsers(users);
          DashboardController.syncUsers(users);
        } catch (error) {
          console.error('Erro ao sincronizar dados:', error);
        }
      });
      
      return originalSend.call(this, data);
    };
    
    next();
  } catch (error) {
    next(error);
  }
};