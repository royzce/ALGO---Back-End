import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { profile } from 'console';
import { Media } from 'src/posts/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
import { EditUserProfileDto } from 'src/profiles/dtos/editProfile.dto';
import { Interest } from 'src/users/entities/interest.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('INTEREST_REPOSITORY')
    private interestRepository: Repository<Interest>,
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
    @Inject('POSTMEDIA_REPOSITORY')
    private postMediaRepository: Repository<Media>,
  ) {}

  async findProfile(_username): Promise<UserProfile> {
    let profile = await this.userProfileRepository.findOne({
      where: { username: _username },
      relations: ['interest'],
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
      relations: ['tags', 'media', 'user', 'comment', 'reactions'],
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
    // user.email = (await this.validateEmail(editProfileDto.email)) || user.email;

    user.email = editProfileDto.email || user.email;
    user.username = editProfileDto.username || user.username;
    user.firstName = editProfileDto.firstName || user.firstName;
    user.lastName = editProfileDto.lastName || user.lastName;
    user.avatar = editProfileDto.avatar || user.avatar;
    user.cover = editProfileDto.cover || user.cover;
    user.bio = editProfileDto.bio || user.bio;

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

    return 'Saved!';
  }

  // validateEmail = async (email) => {
  //   let user = await this.userProfileRepository.findOne({
  //     where: { email: email },
  //   });

  //   if (!user) {
  //     return email;
  //   }
  //   throw new HttpException('Email is already in use', HttpStatus.UNAUTHORIZED);
  // };

  async getAllPhotos(_userId: number): Promise<Media[]> {
    console.log(_userId);
    let photos = await this.postMediaRepository.find({
      where: { userId: _userId },
    });
    console.log(photos);

    return photos;
  }
}
