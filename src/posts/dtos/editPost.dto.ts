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

  @ApiProperty({ minLength: 1 })
  @MinLength(1)
  value: string;

  @ApiProperty({ type: 'number' })
  @IsOptional()
  repostId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  privacy: string;

  // @ApiProperty({type: 'string'})
  // media: media[]

  @ApiProperty({ type: 'string' })
  tags: string;

  @ApiProperty({ type: Date })
  date: Date;
}
