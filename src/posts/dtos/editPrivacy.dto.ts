import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EditPrivacyDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  privacy: string;
}
