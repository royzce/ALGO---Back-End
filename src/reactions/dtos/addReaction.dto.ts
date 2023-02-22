import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddReactionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  postId: number;

  @ApiProperty({ required: true })
  value: string;

  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  date: Date;
}
