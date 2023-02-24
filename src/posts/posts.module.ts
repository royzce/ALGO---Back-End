import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { reactionProviders } from 'src/reactions/providers/reaction.providers';
import { userProfileProviders } from 'src/users/providers/userProfile.providers';
import { Connection } from 'typeorm';
import { PostsController } from './controller/posts/posts.controller';
import { Post } from './entities/post.entity';
import { commentProviders } from './providers/comment.providers';
import { postProviders } from './providers/post.providers';
import { postMediaProviders } from './providers/postMedia.providers';
import { PostsService } from './service/posts/posts.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [
    ...postMediaProviders,
    ...commentProviders,
    ...postProviders,
    {
      provide: 'POSTS_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(Post),
      inject: ['DATABASE_CONNECTION'],
    },
    ...userProfileProviders,
    ...reactionProviders,
    PostsService,
  ] as Provider<any>[],
  exports: [PostsService],
})
export class PostsModule {}
