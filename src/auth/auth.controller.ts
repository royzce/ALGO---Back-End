import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { UsersService } from 'src/users/services/users/users.service';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change.password.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
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

    return this.authService.login(user, loginDto.remember);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() changepasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    return this.authService.changePassword(
      changepasswordDto.old_password,
      changepasswordDto.new_password,
      req.user.userId,
    );
  }
}
