import axios from 'axios';

export class EmailService {
  private n8nWebhookUrl: string;

  constructor() {
    this.n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/email-verification';
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
      
      const emailData = {
        to: email,
        name: name,
        verificationUrl: verificationUrl,
        token: token,
        type: 'email_verification'
      };

      await axios.post(this.n8nWebhookUrl, emailData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Log para debug
      console.log(`📧 FALLBACK - Link de verificação: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`);
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const emailData = {
        to: email,
        name: name,
        type: 'welcome'
      };

      await axios.post(this.n8nWebhookUrl, emailData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }
}