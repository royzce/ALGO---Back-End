import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
  ) {}

  async getNotification(userId: number) {
    let notifs = await this.notificationRepository.find({
      where: { userId: userId, notifFrom: Not(userId) },
      order: { date: 'DESC' },
      relations: ['from'],
    });

    // for (const notif of notifs) {
    //   const { type, typeId: postId, userId } = notif;
    //   let newNotifs = [];
    //   let count = 0;
    //   switch(type) {
    //     case 'reaction': {
    //       const reactions = await findReactionsUsingPostId(postId)
    //       count = reactions.length;
    //     }
    //     break;
    //     case 'share': {
    //       const shares = await findShareUsingPostId(postId)
    //       count = shares.length;
    //     }
    //     break;
    //     case 'requestFriend': {
    //       const friends = await findFriendRequest(userId)
    //       count = friends.length
    //     }
    //     break;

    //     notif = {...notifs, count}
    //     newNotifs.push(notif);
    //   }
    // }
    console.log('notif', notifs);
    return notifs;
  }

  async getNotificationCnt(userId) {
    let notifsCount = await this.notificationRepository.count({
      where: { userId: userId, isRead: false },
    });
    return notifsCount;
  }

  async updateNotification({ notifId }) {
    let notif = await this.notificationRepository.findOne({
      where: { notifId: notifId },
    });

    if (!notif) {
      throw new HttpException('Notification not found', HttpStatus.BAD_REQUEST);
    }

    notif.isRead = true || notif.isRead;

    try {
      notif = await this.notificationRepository.save(notif);
    } catch {
      throw new InternalServerErrorException();
    }

    return notif;
  }

  async deleteNotification({ notifId }) {
    let notif = await this.notificationRepository.findOne({
      where: { notifId: notifId },
    });

    if (!notif) {
      throw new HttpException('Notification not found', HttpStatus.BAD_REQUEST);
    }

    try {
      notif = await this.notificationRepository.remove(notif);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return notif;
  }
}
