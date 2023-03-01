import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { friendProviders } from 'src/friends/providers/friend.provider';
import { FriendsService } from 'src/friends/service/friends/friends.service';
import { notificationProviders } from 'src/notifications/providers/notifications.providers';
import { reactionProviders } from 'src/reactions/providers/reaction.providers';
import { shareProviders } from 'src/shares/providers/share.provider';
import { passwordResetTokenProviders } from 'src/users/providers/password-reset-token.providers';
import { userProfileProviders } from 'src/users/providers/userProfile.providers';
import { UsersService } from 'src/users/services/users/users.service';
import { Connection } from 'typeorm';
import { PostsController } from './controller/posts/posts.controller';
import { Post } from './entities/post.entity';
import { commentProviders } from './providers/comment.providers';
import { postProviders } from './providers/post.providers';
import { postMediaProviders } from './providers/postMedia.providers';
import { tagProviders } from './providers/tag.provider';
import { PostsService } from './service/posts/posts.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [
    ...notificationProviders,
    ...shareProviders,
    ...tagProviders,
    ...postMediaProviders,
    ...commentProviders,
    ...postProviders,
    ...friendProviders,
    ...passwordResetTokenProviders,
    {
      provide: 'POSTS_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(Post),
      inject: ['DATABASE_CONNECTION'],
    },
    ...userProfileProviders,
    ...reactionProviders,

    PostsService,
    FriendsService,
    UsersService,
  ] as Provider<any>[],
  exports: [PostsService],
})
export class PostsModule {}
