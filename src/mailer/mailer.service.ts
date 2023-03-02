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
      from: '"ALGO" <noreply@Algo.com>',
      to,
      subject: 'Password reset link for ALGO',
      html: `
        <div style="background-color: #f2f2f2; padding: 20px;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
            <p style="font-size: 18px; font-weight: bold;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px;">We received a request to reset the password for your <strong>Algo account</strong>. If you did not make this request, please disregard this email.</p>
            <p style="font-size: 16px;">To reset your password, please click on the following button:</p>
            <p style="text-align: center;"><a href="http://localhost:3000/reset-password/${token}" style="background-color: #1e90ff; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px;">Reset Password</a></p>
            <p style="font-size: 16px;">Please note that this link will expire in an hour, so please reset your password as soon as possible.</p>
            <p style="font-size: 16px;">Thank you for using Algo!</p>
            <p style="font-size: 16px;">Best regards,<br><strong>Algo</strong></p>
          </div>
        </div>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
