import { Module } from '@nestjs/common';
import { ProfilesController } from './controller/profiles/profiles.controller';
import { ProfilesService } from './service/profiles/profiles.service';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService]
})
export class ProfilesModule {}
