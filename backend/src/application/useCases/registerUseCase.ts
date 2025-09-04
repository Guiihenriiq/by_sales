import bcrypt from 'bcryptjs';
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

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterRequest): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = User.create({
      ...data,
      password: hashedPassword,
    });

    return await this.userRepository.create(user);
  }
}