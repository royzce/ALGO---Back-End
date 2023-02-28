import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({ required: true, minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)
  new_password: string;
}
