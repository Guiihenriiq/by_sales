import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verificar se o usuário está banido
    if (user.banned === true) {
      throw new Error('Your account has been suspended. Please contact support.');
    }

    // Verificação de email opcional - só bloqueia se N8N estiver configurado
    if (!user.emailVerified && process.env.N8N_WEBHOOK_URL) {
      throw new Error('Please verify your email before logging in');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}