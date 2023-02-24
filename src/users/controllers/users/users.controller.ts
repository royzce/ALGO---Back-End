import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createUserProfileDto } from 'src/users/dtos/createUserProfile.dto';
import { UsersService } from 'src/users/services/users/users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: createUserProfileDto) {
    return this.userService.createNewUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Request() req) {
    return this.userService.getUserInfo(req.user.userId);
  }
}
