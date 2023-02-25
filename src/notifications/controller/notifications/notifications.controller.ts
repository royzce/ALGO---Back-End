import { Controller, Post } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/service/notifications/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Post('/comment')
  comment() {
    return this.notificationService.commented();
  }

  @Post('/friendRequest')
  friendRequest() {
    return 'friendRequest';
  }

  @Post('/reaction')
  Reaction() {
    return 'friendRequest';
  }
}
