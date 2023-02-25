import { ApiProperty } from '@nestjs/swagger';

export class AddFriendDto {
  @ApiProperty({ required: true })
  friendId: number;
}

export class AcceptFrienDto {
  @ApiProperty({ required: true })
  friendId: number;
}
