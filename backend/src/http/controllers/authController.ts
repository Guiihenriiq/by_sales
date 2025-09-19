import { Request, Response } from 'express';
import { LoginUseCase } from '@/application/useCases/loginUseCase';
import { RegisterUseCase } from '@/application/useCases/registerUseCase';
import { VerifyEmailUseCase } from '@/application/useCases/verifyEmailUseCase';
import { UserTypeOrmRepository } from '@/infra/database/typeorm/repositories/UserTypeOrmRepository';
import { SeedController } from './seedController';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['customer', 'admin']).optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;
      
      // Tentar login com usuários em memória primeiro (para teste)
      const users = SeedController.getUsers() || [];
      const user = users.find(u => u.email === email);
      
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          return res.status(400).json({ error: 'Credenciais inválidas' });
        }
        
        if (user.banned) {
          return res.status(400).json({ error: 'Conta suspensa. Entre em contato com o suporte.' });
        }
        
        const token = jwt.sign(
          { userId: user.id, role: user.role },
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '7d' }
        );
        
        return res.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        });
      }
      
      // Fallback para o banco de dados
      const userRepository = new UserTypeOrmRepository();
      const loginUseCase = new LoginUseCase(userRepository);
      
      const result = await loginUseCase.execute({ email, password });
      
      return res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.errors.map(e => e.message)
        });
      }
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { name, email, password, role, phone, address } = validatedData;
      
      const userRepository = new UserTypeOrmRepository();
      const registerUseCase = new RegisterUseCase(userRepository);
      
      const result = await registerUseCase.execute({
        name,
        email,
        password,
        role: role || 'customer',
        phone,
        address,
      });
      
      return res.status(201).json({
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
        message: result.verificationSent 
          ? 'Conta criada! Verifique seu email para ativar a conta.'
          : 'Conta criada com sucesso! Você já pode fazer login.',
        verificationSent: result.verificationSent
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.errors.map(e => e.message)
        });
      }
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, code } = req.query;
      
      if (!email || !code || typeof email !== 'string' || typeof code !== 'string') {
        return res.status(400).json({ error: 'Email and verification code are required' });
      }
      
      // Validate email format
      const emailSchema = z.string().email();
      const codeSchema = z.string().length(6);
      
      try {
        emailSchema.parse(email);
        codeSchema.parse(code);
      } catch {
        return res.status(400).json({ error: 'Invalid email or verification code format' });
      }
      
      const userRepository = new UserTypeOrmRepository();
      const verifyEmailUseCase = new VerifyEmailUseCase(userRepository);
      
      const isValid = await verifyEmailUseCase.execute({
        email,
        verificationCode: code
      });
      
      if (isValid) {
        return res.json({ message: 'Email verificado com sucesso!' });
      } else {
        return res.status(400).json({ error: 'Código de verificação inválido' });
      }
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}