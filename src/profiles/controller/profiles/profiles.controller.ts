import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  UseInterceptors,
  Post,
  Put,
  Body,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EditUserProfileDto } from 'src/profiles/dtos/editProfile.dto';
import { ProfilesService } from 'src/profiles/service/profiles/profiles.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @Get('search')
  getUsersByName(@Query('q') q: string) {
    return this.profileService.getUsersByName(q);
  }

  @Get(':username')
  getUserProfile(@Param('username') username: string) {
    return this.profileService.findProfile(username);
  }

  @Get(':username/post')
  getUserPost(@Param('username') username: string) {
    return this.profileService.getProfilePost(username);
  }

  @Put('/edit')
  editProfile(@Body() editProfileDto: EditUserProfileDto, @Request() req) {
    return this.profileService.editProfile(req.user.userId, editProfileDto);
  }
}
