import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  isNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createUserProfileDto {
  @ApiProperty({ minLength: 5, maxLength: 15 })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  username: string;

  @ApiProperty({ type: 'email' })
  @IsEmail()
  //isUnique
  email: string;

  @ApiProperty({ required: true, maxLength: 30 })
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ required: true, maxLength: 30 })
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ required: true, minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  avatar?: string;
}
