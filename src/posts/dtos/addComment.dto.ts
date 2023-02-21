import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddCommentDto {
  id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ minLength: 1 })
  @IsNotEmpty()
  value: string;

  @ApiProperty({ required: false })
  @IsOptional()
  replyTo: number[];

  @ApiProperty({ required: true })
  @IsNotEmpty()
  date: Date;
}
