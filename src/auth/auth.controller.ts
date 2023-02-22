import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('auth')
  async login(@Body() loginDto: LoginDto) {
    const user = new User();
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

  @UseGuards(JwtAuthGuard)
  @Get('users/me')
  getProfile(@Request() req) {
    return this.authService.getUserInfo(req.sub);
  }
}
