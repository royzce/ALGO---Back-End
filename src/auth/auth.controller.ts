import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { UsersService } from 'src/users/services/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('auth')
  async login(@Body() loginDto: LoginDto) {
    const user = new UserProfile();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(loginDto.username)) {
      user.username = await this.userService.getUserNameByEmail(
        loginDto.username,
      );
    } else {
      user.username = loginDto.username;
    }
    user.password = loginDto.password;
    return this.authService.login(user);
  }
}
