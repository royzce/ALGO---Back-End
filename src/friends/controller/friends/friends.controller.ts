import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AcceptFrienDto, AddFriendDto } from 'src/friends/dtos/addFriend.dto';
import { FriendsService } from 'src/friends/service/friends/friends.service';

@UseGuards(JwtAuthGuard)
@Controller('/friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get()
  getAllFriends(@Request() req) {
    return this.friendsService.getFriendList(req.user.userId);
  }

  @Post('add')
  addFriend(@Body() addFriendDto: AddFriendDto, @Request() req) {
    return this.friendsService.addFriend(addFriendDto, req.user.userId);
  }

  @Post('/accept')
  acceptFriend(@Body() acceptFriendDto: AcceptFrienDto, @Request() req) {
    return this.friendsService.acceptRequest(req.user.userId, acceptFriendDto);
  }
}
