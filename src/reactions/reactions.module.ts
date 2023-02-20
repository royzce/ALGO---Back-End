import { Module } from '@nestjs/common';
import { ReactionsController } from './controller/reactions/reactions.controller';
import { ReactionsService } from './service/reactions/reactions.service';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService]
})
export class ReactionsModule {}
