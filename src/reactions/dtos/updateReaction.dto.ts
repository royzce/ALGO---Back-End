import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateReactionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  postId: number;

  @ApiProperty({ required: false, type: 'string' })
  value: string;
}
