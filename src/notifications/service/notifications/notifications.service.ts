import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
  ) {}

  //notsureyet --testing to check if data is saving
  async commented() {
    let notification = new Notification();

    notification.type = 'comment';
    notification.isRead = false;
    notification.value = "user's comment";
    notification.date = new Date();
    notification.userId = 1;

    notification = await this.notificationRepository.save(notification);

    return 'notif saved';
  }
}
