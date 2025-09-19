import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// Simulação de usuários em memória
let users: any[] = [];

// Inicializar com usuário admin padrão
const initializeAdmin = async () => {
  if (users.length === 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    users.push({
      id: `admin-${Date.now()}`,
      name: 'Administrador',
      email: 'admin@bysales.com',
      password: hashedPassword,
      role: 'admin',
      emailVerified: true,
      banned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
};

// Inicializar admin ao carregar o módulo
initializeAdmin();

export class SeedController {
  async createAdminUser(req: Request, res: Response) {
    try {
      // Verificar se já existe um admin
      const existingAdmin = users.find(u => u.email === 'admin@bysales.com');
      
      if (existingAdmin) {
        return res.json({ message: 'Admin user already exists', user: { email: existingAdmin.email } });
      }

      // Criar usuário admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = {
        id: `admin-${Date.now()}`,
        name: 'Administrador',
        email: 'admin@bysales.com',
        password: hashedPassword,
        role: 'admin',
        emailVerified: true,
        banned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      users.push(adminUser);

      return res.status(201).json({
        message: 'Admin user created successfully',
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role
        },
        credentials: {
          email: 'admin@bysales.com',
          password: 'admin123'
        }
      });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  // Método para sincronizar usuários
  static getUsers() {
    return users;
  }

  static addUser(user: any) {
    users.push(user);
  }
}