import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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

  //deleteAfterTesting
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('me')
  getUser() {
    //return this.userService.findUser();
    return 'awit';
  }

  @Get('search')
  searchUsersByName(@Query('q') q: string) {
    return this.userService.getUsersByName(q);
  }
}
