import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddFriendDto } from 'src/friends/dtos/addFriend.dto';
import { Friend } from 'src/friends/entities/friend.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Brackets } from 'typeorm/query-builder/Brackets';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class FriendsService {
  constructor(
    @Inject('FRIEND_REPOSITORY') private friendRepository: Repository<Friend>,
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async addFriend({ friendId }, userId: number) {
    let user = await this.userProfileRepository.findOne({
      where: { userId: friendId },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    let friendRequest = new Friend();

    friendRequest.userId = userId;
    friendRequest.friendId = friendId;
    friendRequest.status = 'pending';

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
    try {
      friendRequest = await this.friendRepository.save(friendRequest);
    } catch (error) {
      throw new HttpException('Failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return 'accepted';
  }

  async getFriendList(userId: number) {
    const friends = await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.user', 'user')
      .where([
        { status: 'friends', userId: userId },
        { status: 'friends', friendId: userId },
      ])
      .getMany();
    return friends;
  }
}
