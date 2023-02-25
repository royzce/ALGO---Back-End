import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveReactionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  postId: number;
}
