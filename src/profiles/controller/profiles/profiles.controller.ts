import { Controller, Get, Param } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ProfilesService } from 'src/profiles/service/profiles/profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @Get()
  seacrhResult() {
    return 'Profiles';
  }

  @Get(':username')
  userProfile(@Param('username') username: string) {}

  @Get(':username/post')
  userPost() {
    return 'users posts';
  }
}
