import { Controller, Get } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Get()
  async sendEmail() {
    await this.mailerService.sendEmail(
      'yaprendon@gmail.com',
      'SAMPLE EMAIL',
      'text Hello World',
    );
    return 'email sent';
  }
}
