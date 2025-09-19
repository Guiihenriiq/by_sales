import axios from 'axios';
import { User, UserRole } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  address?: string;
}

interface EmailVerificationData {
  email: string;
  name: string;
  verificationCode: string;
  frontendUrl: string;
}

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterRequest): Promise<{ user: User; verificationSent: boolean }> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const verificationCode = Math.random().toString(36).substring(2, 15);

    const user = await User.create({
      ...data,
      emailVerificationToken: verificationCode,
    });

    const createdUser = await this.userRepository.create(user);

    // Enviar email de verificação via n8n (opcional)
    let verificationSent = false;
    try {
      if (process.env.N8N_WEBHOOK_URL) {
        await this.sendVerificationEmail({
          email: data.email,
          name: data.name,
          verificationCode,
          frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
        });
        verificationSent = true;
      }
    } catch (error) {
      console.error('Erro ao enviar email via N8N:', error.response?.data || error.message);
    }

    return { user: createdUser, verificationSent };
  }

  private async sendVerificationEmail(data: EmailVerificationData): Promise<void> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      throw new Error('N8N webhook URL not configured');
    }

    await axios.post(webhookUrl, {
      type: 'email-verification',
      email: data.email,
      name: data.name,
      verificationCode: data.verificationCode,
      verificationLink: `${data.frontendUrl}/verify-email?code=${data.verificationCode}&email=${encodeURIComponent(data.email)}`,
      timestamp: new Date().toISOString()
    }, {
      timeout: 5000
    });
  }
}