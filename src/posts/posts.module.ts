import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database/database.module';
import { userProfileProviders } from 'src/users/providers/userProfile.providers';
import { Connection } from 'typeorm';
import { PostsController } from './controller/posts/posts.controller';
import { Post } from './entities/post.entity';
import { postProviders } from './providers/post.providers';
import { PostsService } from './service/posts/posts.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [
    ...postProviders,
    {
      provide: 'POSTS_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(Post),
      inject: ['DATABASE_CONNECTION'],
    },
    ...userProfileProviders,
    PostsService,
  ] as Provider<any>[],
  exports: [PostsService],
})
export class PostsModule {}
