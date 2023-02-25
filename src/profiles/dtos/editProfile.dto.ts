import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EditUserProfileDto {
  @ApiProperty({ minLength: 5, maxLength: 15 })
  @IsOptional()
  @MinLength(5)
  @MaxLength(15)
  username: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  email: string;

  @ApiProperty({ required: false, maxLength: 30 })
  @IsOptional()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ required: false, maxLength: 30 })
  @IsOptional()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  avatar: string;

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  cover: string;

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  bio: string;

  @ApiProperty({ required: false, type: Array })
  @IsOptional()
  interest: string[];
}
