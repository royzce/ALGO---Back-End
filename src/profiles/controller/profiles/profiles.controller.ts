import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfilesService } from 'src/profiles/service/profiles/profiles.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @Get()
  getUsersByName(@Query('search') search: string) {
    return this.profileService.getUsersByName(search);
  }

  @Get(':username')
  getUserProfile(@Param('username') username: string) {
    return this.profileService.findProfile(username);
  }

  @Get(':username/post')
  getUserPost(@Param('username') username: string) {
    return this.profileService.getProfilePost(username);
  }
}
