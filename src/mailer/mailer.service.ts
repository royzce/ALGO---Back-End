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

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'ALGO <noreply@Algo.com>',
      to,
      subject,
      html:
        '<h1>Verification Code</h1><br>' +
        '<p>Please use the verification code below to sign in.</p><br>' +
        ` <h2> 1299238</h2>` +
        '<p> If you didn’t request this, you can ignore this email.</p><br><p> Thanks,</p><p> Grey Space Team</p>',
    };

    await this.transporter.sendMail(mailOptions);
  }
}
