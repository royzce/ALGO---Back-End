import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DeleteNotifDto {
  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  notifId: number;
}

export class UpdateNotifDto {
  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  notifId: number;
}
