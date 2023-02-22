import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  //   @MinLength(5)
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsOptional()
  avatar: string;
}
