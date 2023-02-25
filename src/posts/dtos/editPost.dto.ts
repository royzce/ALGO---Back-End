import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EditPostDto {
  @ApiProperty({ type: 'boolean' })
  isRepost: boolean;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  value: string;

  @ApiProperty({ type: 'number' })
  @IsOptional()
  repostId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  privacy: string;

  @ApiProperty({ type: Array })
  media: string[];

  @ApiProperty({ type: Array })
  tags: string[];

  @ApiProperty({ type: Date })
  date: Date;
}
