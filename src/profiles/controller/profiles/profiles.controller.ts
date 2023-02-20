import { Controller, Get } from '@nestjs/common';

@Controller('profiles')
export class ProfilesController {
  @Get()
  seacrhResult() {
    return 'Profiles';
  }

  @Get('username')
  userProfile() {
    return 'userProfile';
  }

  @Get('username/post')
  userPost() {
    return 'users posts';
  }
}
