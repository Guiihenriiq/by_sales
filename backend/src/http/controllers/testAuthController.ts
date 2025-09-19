import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserTypeOrmRepository } from '@/infra/database/typeorm/repositories/UserTypeOrmRepository';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

// Gerar hash correto para admin123
const generateAdminUser = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  return {
    id: 'admin-test-123',
    name: 'Administrador',
    email: 'admin@bysales.com',
    password: hashedPassword,
    role: 'admin',
    emailVerified: true,
    banned: false
  };
};

let adminUser: any = null;

// Inicializar usuário admin
generateAdminUser().then(user => {
  adminUser = user;
  console.log('Admin user initialized with password hash');
});

export class TestAuthController {
  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;
      
      console.log('Login attempt:', { email });
      
      // Primeiro tentar com usuário admin fixo
      if (adminUser && email === adminUser.email) {
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);
        
        if (isPasswordValid) {
          const token = jwt.sign(
            { userId: adminUser.id, role: adminUser.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
          );
          
          return res.json({
            user: {
              id: adminUser.id,
              name: adminUser.name,
              email: adminUser.email,
              role: adminUser.role
            },
            token
          });
        }
      }
      
      // Tentar com usuários do banco de dados
      const userRepository = new UserTypeOrmRepository();
      const user = await userRepository.findByEmail(email);
      
      if (!user) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }
      
      // Verificar se o usuário está banido
      if (user.banned === true) {
        return res.status(400).json({ error: 'Sua conta foi suspensa. Entre em contato com o suporte.' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }
      
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );
      
      console.log('Login successful for user:', user.email);
      
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.errors.map(e => e.message)
        });
      }
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}