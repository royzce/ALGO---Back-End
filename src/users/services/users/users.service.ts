import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createUserProfileDto } from 'src/users/dtos/createUserProfile.dto';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Like } from 'typeorm/find-options/operator/Like';

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

  //from Royce
  async findOne(username: string) {
    return this.userProfileRepository.findOne({ where: { username } });
  }

  //from Royce
  async findUserById(id: number) {
    let user = await this.userProfileRepository.findOneBy({ userId: id });
    user.password = undefined;

    return user;
  }

  async getUserNameByEmail(email: string) {
    let user = await this.userProfileRepository.findOneBy({ email });
    return user.username;
  }
  //new
  async getUsersByName(query: string) {
    return await this.userProfileRepository.find({
      select: { userId: true, firstName: true, lastName: true, avatar: true },
      where: { firstName: Like(`%${query}%`) },
    });
  }

  //deleteAfterTesting
  getAllUsers() {}
}
