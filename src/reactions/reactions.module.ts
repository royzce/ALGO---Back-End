import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { postProviders } from 'src/posts/providers/post.providers';
import { Connection } from 'typeorm/connection/Connection';
import { ReactionsController } from './controller/reactions/reactions.controller';
import { Reaction } from './entities/reaction.entity';
import { reactionProviders } from './providers/reaction.providers';
import { ReactionsService } from './service/reactions/reactions.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReactionsController],
  providers: [...reactionProviders, ...postProviders, ReactionsService],
  exports: [ReactionsService],
})
export class ReactionsModule {}
