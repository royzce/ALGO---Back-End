import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({ minLength: 1 })
  @IsNotEmpty()
  value: string;

  @ApiProperty({ required: false })
  @IsOptional()
  replyTo: number;

  @ApiProperty({ required: true, type: 'boolean' })
  @IsNotEmpty()
  isEdited: boolean;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  date: Date;
}
