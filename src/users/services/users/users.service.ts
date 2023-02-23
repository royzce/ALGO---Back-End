import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createUserProfileDto } from 'src/users/dtos/createUserProfile.dto';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async createNewUser(userDto: createUserProfileDto) {
    let user = await this.userProfileRepository.findOne({
      where: { username: userDto.username },
    });
    if (user) {
      throw new HttpException('username taken', HttpStatus.BAD_REQUEST);
    }
    user = new UserProfile();
    user.username = userDto.username;
    user.firstName = userDto.firstName;
    user.lastName = userDto.lastName;
    user.email = userDto.email;
    const saltOrRounds = 10;
    user.password = await bcrypt.hash(userDto.password, saltOrRounds);
    user.avatar = userDto.avatar;
    user.cover = '';
    user.bio = '';
    user.friends = '';
    user.interest = '';

    user = await this.userProfileRepository.save(user);
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

  async getUserInfo(id: number): Promise<UserProfile> {
    return this.userProfileRepository.findOneBy({ userId: id });
  }
}