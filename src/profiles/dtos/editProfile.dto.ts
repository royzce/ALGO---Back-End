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
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  username: string;

  @ApiProperty({ type: 'string' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, maxLength: 30 })
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ required: true, maxLength: 30 })
  @IsNotEmpty()
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
}
