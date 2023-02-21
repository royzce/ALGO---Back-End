import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: true, type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ minLength: 1 })
  @MinLength(1)
  value: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  privacy: string;

  @ApiProperty({ type: Date })
  date: Date;

  @ApiProperty({ type: 'string' })
  tags: string;

  @ApiProperty({ type: 'boolean' })
  isRepost: boolean;
}
