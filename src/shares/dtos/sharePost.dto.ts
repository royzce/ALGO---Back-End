import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SharePostDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  postId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  date: Date;
}
