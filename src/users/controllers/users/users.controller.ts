import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  createUser() {
    return 'create a user route';
  }

  @Get('me')
  getUser() {
    return this.userService.findUser();
  }
}
