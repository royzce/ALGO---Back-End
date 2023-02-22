import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { UserProfile } from 'src/users/entities/userProfile.entity';

@Controller('auth')
export class AuthController {
  @Post()
  login(@Body() loginDto: LoginDto) {
    const user = new UserProfile();
    return 'user';
  }
}
