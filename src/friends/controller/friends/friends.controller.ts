import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  AcceptFrienDto,
  AddFriendDto,
  DeleteFrienDto,
  RejectFriendDto,
} from 'src/friends/dtos/addFriend.dto';
import { FriendsService } from 'src/friends/service/friends/friends.service';

@UseGuards(JwtAuthGuard)
@Controller('/friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get()
  getAllFriends(@Request() req) {
    return this.friendsService.getFriendList(req.user.userId);
  }

  @Get('/request')
  getFriendRequest(@Request() req) {
    return this.friendsService.getFriendRequest(req.user.userId);
  }
  @Post('add')
  addFriend(@Body() addFriendDto: AddFriendDto, @Request() req) {
    return this.friendsService.addFriend(addFriendDto, req.user.userId);
  }

  @Post('/delete')
  deleteFriend(@Body() deleteFriendDto: DeleteFrienDto, @Request() req) {
    return this.friendsService.deleteFriend(
      deleteFriendDto.friendId,
      req.user.userId,
    );
  }

  @Delete('reject')
  rejectFriend(@Body() rejectFriendDto: RejectFriendDto, @Request() req) {
    return this.friendsService.rejectFriend(
      rejectFriendDto.friendId,
      req.user.userId,
    );
  }

  @Post('/accept')
  acceptFriend(@Body() acceptFriendDto: AcceptFrienDto, @Request() req) {
    return this.friendsService.acceptRequest(req.user.userId, acceptFriendDto);
  }
}
