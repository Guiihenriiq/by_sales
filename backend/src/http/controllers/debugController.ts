import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserTypeOrmRepository } from '@/infra/database/typeorm/repositories/UserTypeOrmRepository';

export class DebugController {
  async resetUserPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;
      
      if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and newPassword are required' });
      }
      
      const userRepository = new UserTypeOrmRepository();
      const user = await userRepository.findByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      
      await userRepository.update(user);
      
      return res.json({
        message: 'Password updated successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}