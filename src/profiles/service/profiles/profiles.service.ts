import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { profile } from 'console';
import { Post } from 'src/posts/entities/post.entity';
import { EditUserProfileDto } from 'src/profiles/dtos/editProfile.dto';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
  ) {}

  async findProfile(_username): Promise<UserProfile> {
    let profile = await this.userProfileRepository.findOne({
      where: { username: _username },
    });

    return profile;
  }

  async getProfilePost(_username): Promise<Post[]> {
    const user = await this.userProfileRepository.findOne({
      where: { username: _username },
    });

    const userId = user.userId;

    let profile = await this.postRepository.find({
      where: { userId: userId },
      relations: ['user', 'comment', 'reactions'],
    });

    return profile;
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
  ): Promise<string> {
    let user = await this.userProfileRepository.findOne({
      where: { userId: userId },
    });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    user.email = (await this.validateEmail(editProfileDto.email)) || user.email;
    user.username = editProfileDto.username || user.username;
    user.firstName = editProfileDto.firstName || user.firstName;
    user.lastName = editProfileDto.lastName || user.lastName;
    user.avatar = editProfileDto.avatar || user.avatar;
    user.cover = editProfileDto.cover || user.cover;
    user.bio = editProfileDto.bio || user.bio;

    user = await this.userProfileRepository.save(user);

    return 'Saved!';
  }

  validateEmail = async (email) => {
    let user = await this.userProfileRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      return email;
    }
    throw new HttpException('Email is already in use', HttpStatus.UNAUTHORIZED);
  };
}
