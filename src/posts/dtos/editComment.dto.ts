import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class EditCommentDto {
  @ApiProperty({ minLength: 1 })
  @IsNotEmpty()
  value: string;
}
