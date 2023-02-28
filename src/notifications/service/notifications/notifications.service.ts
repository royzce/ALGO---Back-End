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

  async getNotification(userId: number) {
    let notifs = await this.notificationRepository.find({
      where: { userId: userId },
      order: { date: 'DESC' },
      relations: ['from'],
    });

    return notifs;
  }

  async getNotificationCnt(userId) {
    let notifsCount = await this.notificationRepository.count({
      where: { userId: userId, isRead: false },
    });

    return notifsCount;
  }
}
