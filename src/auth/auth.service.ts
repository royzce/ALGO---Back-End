import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
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
        sub: result.id,
      };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    }

    throw new BadRequestException('Invalid username / password.');
  }

  async getUserInfo(id: number) {
    return this.usersService.findUserById(id);
  }
}
