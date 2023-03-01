import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      // port: 465,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PWD'),
      },
    });
  }

  async sendResetPasswordEmail(to: string, token: string, name: string) {
    const mailOptions = {
      from: 'ALGO <noreply@Algo.com>',
      to,
      subject: 'Password reset link for ALGO',
      html:
        `<p>Hi <strong>${name}</strong>,</p>` +
        `<p>We received a request to reset the password for your <strong>Algo account</strong>. If you did not make this request, please disregard this email.</p>` +
        `<p>To reset your password, please click on the following link:</p>` +
        ` <p><button><a href="http://localhost:3000/reset-password/${token}">Reset Password</a></button></p>` +
        ` <p>Please note that this link will expire in an hour, so please reset your password as soon as possible.</p>` +
        `    <p>Thank you for using Algo!</p>` +
        `<p>Best regards,<br><strong>Algo</strong></p>`,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
