import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ProfilesService } from 'src/profiles/service/profiles/profiles.service';
import { Query } from 'typeorm/driver/Query';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  // @Get()
  // seacrhProfile(@Query('searchQuery') searchQuery: string) {
  //   return 'Profiles';
  // }

  @Get(':username')
  getUserProfile(@Param('username') username: string) {
    return this.profileService.findProfile(username);
  }

  @Get(':username/post')
  getUserPost(@Param('username') username: string) {
    return this.profileService.getProfilePost(username);
  }
}
