import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createUserProfileDto } from 'src/users/dtos/createUserProfile.dto';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async createNewUser(userDto: createUserProfileDto) {
    console.log('went here');
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
    user.password = userDto.password;
    user.avatar = userDto.avatar;

    user = await this.userProfileRepository.save(user);
  }

  //deleteAfterTesting
  getAllUsers() {}
}
