import { Request, Response } from 'express';
import { UserTypeOrmRepository } from '@/infra/database/typeorm/repositories/UserTypeOrmRepository';

export class TestController {
  async verifyUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      
      const userRepository = new UserTypeOrmRepository();
      const user = await userRepository.findByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Verificar email diretamente
      await user.verifyEmail();
      await userRepository.update(user);
      
      return res.json({ 
        message: 'Email verified successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified
        }
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}