import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createUserProfileDto } from 'src/users/dtos/createUserProfile.dto';
import { UsersService } from 'src/users/services/users/users.service';
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: createUserProfileDto) {
    return this.userService.createNewUser(createUserDto);
  }

  //kirito
  //Sw0rd@rt

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Request() req) {
    console.log(req.sub);
    return this.userService.getUserInfo(req.sub);
  }
}
