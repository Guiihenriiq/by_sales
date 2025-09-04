import { Request, Response } from 'express';
import { LoginUseCase } from '@/application/useCases/loginUseCase';
import { RegisterUseCase } from '@/application/useCases/registerUseCase';
import { UserTypeOrmRepository } from '@/infra/database/typeorm/repositories/UserTypeOrmRepository';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const userRepository = new UserTypeOrmRepository();
      const loginUseCase = new LoginUseCase(userRepository);
      
      const result = await loginUseCase.execute({ email, password });
      
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role, phone, address } = req.body;
      
      const userRepository = new UserTypeOrmRepository();
      const registerUseCase = new RegisterUseCase(userRepository);
      
      const user = await registerUseCase.execute({
        name,
        email,
        password,
        role,
        phone,
        address,
      });
      
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}