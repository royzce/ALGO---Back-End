import {
  Catch,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { createUserProfileDto } from 'src/users/dtos/createUserProfile.dto';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Like } from 'typeorm/find-options/operator/Like';
import { Interest } from 'src/users/entities/interest.entity';
import { use } from 'passport';
import { Not } from 'typeorm/find-options/operator/Not';
import { PasswordResetToken } from 'src/users/entities/password-reset-token.entity';
import { Friend } from 'src/friends/entities/friend.entity';
import { PreviousPassword } from 'src/users/entities/previous-password';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
    @Inject('PASSWORDRESET_REPOSITORY')
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    @Inject('FRIEND_REPOSITORY')
    private friendRepository: Repository<Friend>,
    @Inject('PREVIOUSPASS_REPOSITORY')
    private previousPasswordRepository: Repository<PreviousPassword>,
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

    let savePass = new PreviousPassword();
    savePass.userId = user.userId;
    savePass.previousPassword = user.password;
    try {
      savePass = await this.previousPasswordRepository.save(savePass);
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

    return user;
  }

  async getUserNameByEmail(email: string): Promise<string> {
    let user = await this.userProfileRepository.findOneBy({ email });
    return user.username;
  }

  async getUsersByName(query: string) {
    return await this.userProfileRepository.find({
      select: { userId: true, firstName: true, lastName: true, avatar: true },
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
      ],
    });
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
    if (user) {
      return 'taken';
    }
    return 'available';
  }

  async validateEmail(email: string) {
    let user = await this.userProfileRepository.findOne({
      where: { email: email },
    });

    if (user) {
      return 'taken';
    }
    return 'available';
  }
  async getUserByEmail(email: string): Promise<UserProfile> {
    return this.userProfileRepository.findOne({
      where: { email },
    });
  }

  async updateUser(user: any) {
    await this.userProfileRepository.save(user);
  }

  async findPwdResetToken() {
    return await this.passwordResetTokenRepository.find();
  }

  async addResetTokenTodb(tokenInfo) {
    return await this.passwordResetTokenRepository.save(tokenInfo);
  }

  async checkIfResetPwdTokenIsInDB(token: string) {
    return await this.passwordResetTokenRepository.findOneBy({
      tokenValue: token,
    });
  }

  async removePrevToken(email: string) {
    return await this.passwordResetTokenRepository.delete({ email });
  }

  async removeResetPwdToken(token: string) {
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: { tokenValue: token },
    });
    await this.passwordResetTokenRepository.remove(resetToken);
  }

  async getAllUsers() {
    const users = await this.userProfileRepository.find({
      // where: {},
      relations: ['interest'],
    });
    return users;
  }

  async checkIfPasswordExisting(password: string, userId: number) {
    const existing = await this.previousPasswordRepository.find({
      where: { userId },
    });

    for (const prevPass of existing) {
      let result = await bcrypt.compare(password, prevPass.previousPassword);
      if (result) {
        return true;
      }
    }
    return false;
  }

  async savePrevPassword(password: string, userId: number) {
    let prevPass = new PreviousPassword();
    prevPass.userId = userId;
    prevPass.previousPassword = password;
    prevPass = await this.previousPasswordRepository.save(prevPass);
  }
}
