import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class EditCommentDto {
  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  value: string;
}
