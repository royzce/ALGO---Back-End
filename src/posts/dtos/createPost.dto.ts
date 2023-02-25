import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ type: 'boolean' })
  isRepost: boolean;

  @ApiProperty({ minLength: 1 })
  @MinLength(1)
  value: string;

  @ApiProperty({ type: 'number' })
  @IsOptional()
  repostId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  privacy: string;

  @ApiProperty({ type: Array })
  @IsOptional()
  media: string[];

  @ApiProperty({ type: Array })
  @IsOptional()
  tags: string[];

  @ApiProperty({ type: Date })
  date: Date;
}
