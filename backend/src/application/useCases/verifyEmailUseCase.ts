import { IUserRepository } from '@/domain/repositories/IUserRepository';

interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export class VerifyEmailUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, verificationCode }: VerifyEmailRequest): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      return true; // Já verificado
    }

    if (user.emailVerificationToken !== verificationCode) {
      throw new Error('Invalid verification code');
    }

    await user.verifyEmail();
    await this.userRepository.save(user);
    
    return true;
  }
}