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

  async sendResetPasswordEmail(to: string, token: string) {
    const mailOptions = {
      from: 'ALGO <noreply@Algo.com>',
      to,
      subject: 'Password reset link for ALGO',
      html:
        `<p>Dear <strong>Algo user</strong>,</p>` +
        `<p>We have received a request to reset the password for your <strong>Algo account</strong> associated with this email address. If you did not make this request, please disregard this email.</p>` +
        `<p>To reset your password, please click on the following link within the next hour:</p>` +
        ` <p><a href="http://localhost:3000/change-password/token">localhost:3000/change-password/token</a></p>` +
        ` <p>Please note that this link will expire in an hour, so please reset your password as soon as possible.</p>` +
        `<p>If you experience any issues with resetting your password or believe this request was made in error, please contact our customer support team at support@algo.com.</p>` +
        `    <p>Thank you for using Algo!</p>` +
        `<p>Best regards,<br><strong>Algo Team</strong></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
