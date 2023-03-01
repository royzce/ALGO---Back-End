import { ApiProperty } from '@nestjs/swagger';

export class AddFriendDto {
  @ApiProperty({ required: true })
  friendId: number;

  @ApiProperty({ type: Date })
  date: Date;
}

export class AcceptFrienDto {
  @ApiProperty({ required: true })
  friendId: number;
}

export class RejectFriendDto {
  @ApiProperty({ required: true })
  friendId: number;
}

export class DeleteFrienDto {
  @ApiProperty({ required: true })
  friendId: number;
}
