import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { profile } from 'console';
import { Friend } from 'src/friends/entities/friend.entity';
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
        { userId: currentUserId, friendId: user.userId },
        { userId: user.userId, friendId: currentUserId },
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
          'media',
          'user',
          'comment',
          'comment.user',
          'reactions',
          'reactions.user',
          'shares',
          'shares.user',
          'tags',
        ],
      });
    } else {
      return await this.postRepository.find({
        where: { userId: user.userId, privacy: 'public' },
        relations: [
          'media',
          'user',
          'comment',
          'comment.user',
          'reactions',
          'reactions.user',
          'shares',
          'shares.user',
          'tags',
        ],
      });
    }
  }

  async getUsersByName(query: string): Promise<UserProfile[]> {
    return await this.userProfileRepository.find({
      select: { userId: true, firstName: true, lastName: true, avatar: true },
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
      ],
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
    user.bio = editProfileDto.bio || user.bio;

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
    console.log(_userId);
    let photos = await this.postMediaRepository.find({
      where: { userId: _userId },
    });
    console.log(photos);

    return photos;
  }

  async validateUsername(username: string, userId: number) {
    if (username !== null) {
      let user = await this.userProfileRepository.findOne({
        where: { username: username, userId: Not(userId) },
      });
      console.log('from user', user);
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
      console.log('from email', user);

      if (user) {
        return 'taken';
      }
    }

    return 'available';
  }
}
