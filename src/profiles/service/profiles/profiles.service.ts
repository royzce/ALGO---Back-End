import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { profile } from 'console';
import { Friend } from 'src/friends/entities/friend.entity';
import { FriendsService } from 'src/friends/service/friends/friends.service';
import { Media } from 'src/posts/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
import { EditUserProfileDto } from 'src/profiles/dtos/editProfile.dto';
import { Share } from 'src/shares/entities/share.entity';
import { Interest } from 'src/users/entities/interest.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { UsersService } from 'src/users/services/users/users.service';
import { Like, Repository } from 'typeorm';
import { Not } from 'typeorm/find-options/operator/Not';

@Injectable()
export class ProfilesService {
  constructor(
    private userService: UsersService,

    @Inject('INTEREST_REPOSITORY')
    private interestRepository: Repository<Interest>,
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
    @Inject('POSTMEDIA_REPOSITORY')
    private postMediaRepository: Repository<Media>,
    @Inject('FRIEND_REPOSITORY')
    private friendRepository: Repository<Friend>,
    @Inject('SHARE_REPOSITORY')
    private shareRepository: Repository<Share>,
    private friendService: FriendsService,
  ) {}

  async findProfile(_username): Promise<UserProfile> {
    let profile = await this.userProfileRepository.findOne({
      where: { username: _username },
      relations: ['interest'],
    });

    return profile;
  }

  async getProfilePost(_username, currentUserId): Promise<Post[]> {
    const user = await this.userProfileRepository.findOne({
      where: { username: _username },
    });

    const friend = await this.friendRepository.findOne({
      where: [
        { userId: currentUserId, friendId: user.userId, status: 'friends' },
        { userId: user.userId, friendId: currentUserId, status: 'friends' },
      ],
    });

    // const userId = user.userId;
    if (friend) {
      return await this.postRepository.find({
        where: [
          { userId: user.userId, privacy: 'public' },
          { userId: user.userId, privacy: 'friends' },
        ],
        relations: [
          'tags',
          'tags.user',
          'shares',
          'shares.user',
          'media',
          'user',
          'comment',
          'comment.user',
          'reactions',
          'reactions.user',
        ],
      });
    } else {
      return await this.postRepository.find({
        where: { userId: user.userId, privacy: 'public' },
        relations: [
          'tags',
          'tags.user',
          'shares',
          'shares.user',
          'media',
          'user',
          'comment',
          'comment.user',
          'reactions',
          'reactions.user',
        ],
      });
    }
  }

  async getUsersByName(query: string): Promise<UserProfile[]> {
    return await this.userProfileRepository.find({
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
      ],
      take: 5,
    });
  }

  async editProfile(
    userId,
    editProfileDto: EditUserProfileDto,
  ): Promise<UserProfile> {
    let user = await this.userProfileRepository.findOne({
      where: { userId: userId },
    });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    if (
      (await this.validateUsername(editProfileDto.username, userId)) === 'taken'
    ) {
      throw new HttpException('username taken', HttpStatus.BAD_REQUEST);
    }

    if ((await this.validateEmail(editProfileDto.email, userId)) === 'taken') {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.email = editProfileDto.email || user.email;
    user.username = editProfileDto.username || user.username;
    user.firstName = editProfileDto.firstName || user.firstName;
    user.lastName = editProfileDto.lastName || user.lastName;
    user.avatar = editProfileDto.avatar || user.avatar;
    user.cover = editProfileDto.cover || user.cover;
    user.bio =
      editProfileDto.bio !== undefined || null ? editProfileDto.bio : user.bio;

    if (editProfileDto.interest) {
      await this.interestRepository.delete({ userId });
    }

    if (editProfileDto.interest) {
      editProfileDto.interest.forEach(async (i) => {
        let interest = new Interest();

        interest.userId = userId;
        interest.interest = i;

        try {
          interest = await this.interestRepository.save(interest);
        } catch (error) {
          throw new InternalServerErrorException();
        }
      });
    }

    user = await this.userProfileRepository.save(user);

    return this.userService.getUserInfo(userId);
  }

  async getAllPhotos(_userId: number): Promise<Media[]> {
    let photos = await this.postMediaRepository.find({
      where: { userId: _userId },
      order: {
        mediaId: 'DESC',
      },
    });

    return photos;
  }

  async validateUsername(username: string, userId: number) {
    if (username !== null) {
      let user = await this.userProfileRepository.findOne({
        where: { username: username, userId: Not(userId) },
      });
      if (user) {
        return 'taken';
      }
    }

    return 'available';
  }

  async validateEmail(email: string, userId: number) {
    if (email !== null) {
      let user = await this.userProfileRepository.findOne({
        where: { email: email, userId: Not(userId) },
      });

      if (user) {
        return 'taken';
      }
    }

    return 'available';
  }

  async getNonFriend(currentUserId: number) {
    const friends = await this.friendRepository.find({
      where: [{ userId: currentUserId }, { friendId: currentUserId }],
    });
    const allUsers = await this.userProfileRepository.find({
      where: { userId: Not(currentUserId) },
    });
    return allUsers.filter((user) => {
      const res = friends.find(
        (friend) =>
          friend.friendId === user.userId || friend.userId === user.userId,
      );
      if (res) {
        return false;
      }
      return true;
    });
  }

  async getUserAndPhotos(username: string) {
    let user = await this.userProfileRepository.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new HttpException('Username mot found', HttpStatus.NOT_FOUND);
    }

    let users = await this.friendService.getFriend(user.userId);

    return users;
  }

  async getUserStatus(usernameOfRandom: string, currentUserId: number) {
    // friends, sender, acceptor, stranger
    const randomUser = await this.userProfileRepository.findOne({
      where: { username: usernameOfRandom },
    });
    //check if the username is the current user
    if (randomUser.userId === currentUserId) {
      return { userstatus: 'you' };
    }

    //check if username is your friend
    const isFriends = await this.friendRepository.findOne({
      where: [
        {
          userId: currentUserId,
          friendId: randomUser.userId,
          status: 'friends',
        },
        {
          userId: randomUser.userId,
          friendId: currentUserId,
          status: 'friends',
        },
      ],
    });
    if (isFriends) {
      return { userStatus: 'friends' };
    }

    //check if this you send friend request to this user
    const isSender = await this.friendRepository.findOne({
      where: {
        userId: randomUser.userId,
        friendId: currentUserId,
        status: 'pending',
      },
    });

    if (isSender) {
      return { userStatus: 'sender' };
    }

    //check if this user sends a friend request to you
    const isAcceptor = await this.friendRepository.findOne({
      where: {
        userId: currentUserId,
        friendId: randomUser.userId,
        status: 'pending',
      },
    });

    if (isAcceptor) {
      return { userStatus: 'acceptor' };
    }

    //else this is stranger to you
    return { userStatus: 'stranger' };
  }
}
