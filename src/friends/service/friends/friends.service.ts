import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Friend } from 'src/friends/entities/friend.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
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

    let friendList = user.filter((user) => user.userId !== userId);
    return friendList;
  }

  async getFriend(friendId: number): Promise<UserProfile> {
    let user = await this.userProfileRepository.findOne({
      where: { userId: friendId },
    });
    return user;
  }
}
