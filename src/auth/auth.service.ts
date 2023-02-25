import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/services/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.username);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const { password, ...result } = user;

      const payload = {
        sub: result.userId,
      };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }

    throw new BadRequestException('Invalid username / password.');
  }
  //   function setWithExpiry(key, value, expiration) {
  //     const now = new Date()

  //     // `item` is an object which contains the original value
  //     // as well as the time when it's supposed to expire
  //     const item = {
  //         value: value,
  //         expiry: now.getTime() + expiration,
  //     }
  //     localStorage.setItem(key, JSON.stringify(item))
  // }
}
