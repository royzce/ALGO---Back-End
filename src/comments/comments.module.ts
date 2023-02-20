import { Module } from '@nestjs/common';
import { CommentsController } from './controller/comments/comments.controller';
import { CommentsService } from './service/comments/comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
