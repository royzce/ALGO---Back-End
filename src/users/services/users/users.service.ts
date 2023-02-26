import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createUserProfileDto } from 'src/users/dtos/createUserProfile.dto';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Like } from 'typeorm/find-options/operator/Like';
import { Interest } from 'src/users/entities/interest.entity';
import { use } from 'passport';
import { Not } from 'typeorm/find-options/operator/Not';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async createNewUser(userDto: createUserProfileDto) {
    let user = new UserProfile();
    if ((await this.validateUsername(userDto.username)) === 'taken') {
      throw new HttpException('username taken', HttpStatus.BAD_REQUEST);
    }
    if ((await this.validateEmail(userDto.email)) === 'taken') {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.username = userDto.username;
    user.firstName = userDto.firstName;
    user.lastName = userDto.lastName;

    user.email = userDto.email;
    const saltOrRounds = 10;
    user.password = await bcrypt.hash(userDto.password, saltOrRounds);
    user.avatar = userDto.avatar;
    user.cover = '';
    user.bio = '';
    user.interest = [];

    try {
      user = await this.userProfileRepository.save(user);
    } catch (error) {
      throw new HttpException(
        'Registration Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return user;
  }

  async findOne(username: string): Promise<UserProfile> {
    return this.userProfileRepository.findOne({ where: { username } });
  }

  async findUserById(id: number): Promise<UserProfile> {
    let user = await this.userProfileRepository.findOneBy({ userId: id });
    user.password = undefined;

    return user;
  }

  async getUserNameByEmail(email: string): Promise<string> {
    let user = await this.userProfileRepository.findOneBy({ email });
    return user.username;
  }

  async getUsersByName(query: string) {
    // if (query.trim().length > 0) {
    return await this.userProfileRepository.find({
      select: { userId: true, firstName: true, lastName: true, avatar: true },
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
      ],
    });
    // } else {
    //   return;
    // }
  }

  async getUserInfo(id: number): Promise<UserProfile> {
    return this.userProfileRepository.findOne({
      where: { userId: id },
      relations: ['interest'],
    });
  }

  async validateUsername(username: string) {
    let user = await this.userProfileRepository.findOne({
      where: { username: username },
    });
    console.log('from user', user);
    if (user) {
      return 'taken';
    }
    return 'available';
  }

  async validateEmail(email: string) {
    let user = await this.userProfileRepository.findOne({
      where: { email: email },
    });
    console.log('from email', user);

    if (user) {
      return 'taken';
    }
    return 'available';
  }
}
