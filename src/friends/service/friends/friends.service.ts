import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddFriendDto } from 'src/friends/dtos/addFriend.dto';
import { Friend } from 'src/friends/entities/friend.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class FriendsService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
    @Inject('FRIEND_REPOSITORY') private friendRepository: Repository<Friend>,
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async addFriend(addFriendDto: AddFriendDto, userId: number) {
    let user = await this.userProfileRepository.findOne({
      where: { userId: addFriendDto.friendId },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    let friendRequest = new Friend();

    friendRequest.userId = userId;
    friendRequest.friendId = addFriendDto.friendId;
    friendRequest.date = addFriendDto.date;
    friendRequest.status = 'pending';

    let notifExist = await this.notificationRepository.findOne({
      where: {
        type: 'requestFriend',
        typeId: 0,
        userId: addFriendDto.friendId,
      },
    });

    if (notifExist) {
      notifExist.type = 'requestFriend';
      notifExist.userId = addFriendDto.friendId;
      notifExist.date = addFriendDto.date;
      notifExist.notifFrom = userId;
      notifExist.isRead = false;
      notifExist.typeId = 0;
      notifExist.count = await this.friendRepository.count({
        where: { userId: userId, status: 'pending' },
      });

      notifExist = await this.notificationRepository.save(notifExist);
    } else {
      let notification = new Notification();
      notification.type = 'requestFriend';
      notification.userId = addFriendDto.friendId;
      notification.isRead = false;
      notification.typeId = 0;
      notification.notifFrom = userId;
      notification.date = addFriendDto.date;
      notification.count = 1;

      try {
        notification = await this.notificationRepository.save(notification);
      } catch (error) {
        throw new HttpException(
          'Failed saving notification',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    try {
      friendRequest = await this.friendRepository.save(friendRequest);
    } catch (error) {
      throw new HttpException(
        'Request Failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return 'friend request sent';
  }

  async acceptRequest(_userId: number, { friendId }) {
    let friendRequest = await this.friendRepository.findOne({
      where: { friendId: _userId, userId: friendId },
    });
    friendRequest.status = 'friends';
    friendRequest.date = new Date();

    try {
      friendRequest = await this.friendRepository.save(friendRequest);
    } catch (error) {
      throw new HttpException('Failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let notifExist = await this.notificationRepository.findOne({
      where: { type: 'acceptFriend', typeId: 0 },
    });

    if (notifExist) {
      notifExist.type = 'acceptFriend';
      notifExist.userId = friendRequest.friendId;
      notifExist.date = friendRequest.date;
      notifExist.notifFrom = _userId;
      notifExist.isRead = false;
      notifExist.typeId = 0;
      notifExist.count = await this.friendRepository.count({
        where: { userId: _userId, status: 'friends' },
      });

      notifExist = await this.notificationRepository.save(notifExist);
    } else {
      let notification = new Notification();
      notification.type = 'acceptFriend';
      notification.userId = friendRequest.friendId;
      notification.date = friendRequest.date;
      notification.isRead = false;
      notification.notifFrom = _userId;
      notification.typeId = 0;
      notification.count = 1;

      notification = await this.notificationRepository.save(notification);
    }

    // try {
    //   notification = await this.notificationRepository.save(notification);
    // } catch (error) {
    //   throw new HttpException(
    //     'Failed saving notification',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }

    return 'accepted';
  }

  async getFriendRequest(userId: number) {
    const res = await this.friendRepository.find({
      where: { friendId: userId, status: 'pending' },
      relations: ['user.friends'],
    });
    return res;
  }

  async rejectFriend(friendId: number, userId: number) {
    const user = await this.friendRepository.find({
      where: { friendId: userId, status: 'pending' },
    });
    return await this.friendRepository.remove(user);
  }

  async getFriendList(userId: number): Promise<UserProfile[]> {
    const friends = await this.friendRepository
      .createQueryBuilder('friend')
      .where([
        { status: 'friends', userId: userId },
        { status: 'friends', friendId: userId },
      ])
      .getMany();

    const user: UserProfile[] = [];

    for (let friend of friends) {
      user.push(await this.getFriend(friend.userId));
      user.push(await this.getFriend(friend.friendId));
    }

    const friendList = user.filter((user) => user.userId !== userId);
    return friendList;
  }

  async getFriend(friendId: number): Promise<UserProfile> {
    let user = await this.userProfileRepository.findOne({
      where: { userId: friendId },
      relations: ['media'],
    });
    return user;
  }

  async deleteFriend(friendId: number, userId: number) {
    let friend = await this.friendRepository.findOne({
      where: [
        // { status: 'friends', userId: userId, friendId: friendId },
        // { status: 'friends', friendId: userId, userId: friendId },
        { userId: userId, friendId: friendId },
        { friendId: userId, userId: friendId },
      ],
    });

    console.log('INSIDE deletefriend', friend);

    friend = await this.friendRepository.remove(friend);

    return friend;
  }
}
