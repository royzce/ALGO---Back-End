import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { friendProviders } from 'src/friends/providers/friend.provider';
import { FriendsService } from 'src/friends/service/friends/friends.service';
import { notificationProviders } from 'src/notifications/providers/notifications.providers';
import { Post } from 'src/posts/entities/post.entity';
import { commentProviders } from 'src/posts/providers/comment.providers';
import { postProviders } from 'src/posts/providers/post.providers';
import { postMediaProviders } from 'src/posts/providers/postMedia.providers';
import { tagProviders } from 'src/posts/providers/tag.provider';
import { PostsService } from 'src/posts/service/posts/posts.service';
import { shareProviders } from 'src/shares/providers/share.provider';
import { passwordResetTokenProviders } from 'src/users/providers/password-reset-token.providers';
import { previousPasswordProviders } from 'src/users/providers/previous-password.providers';
import { userProfileProviders } from 'src/users/providers/userProfile.providers';
import { UsersService } from 'src/users/services/users/users.service';
import { Connection } from 'typeorm/connection/Connection';
import { ReactionsController } from './controller/reactions/reactions.controller';
import { reactionProviders } from './providers/reaction.providers';
import { ReactionsService } from './service/reactions/reactions.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReactionsController],
  providers: [
    ...friendProviders,
    ...notificationProviders,
    ...userProfileProviders,
    ...commentProviders,
    ...shareProviders,
    ...reactionProviders,
    ...postProviders,
    ...tagProviders,
    ...postMediaProviders,
    ...postProviders,
    ...passwordResetTokenProviders,
    ...previousPasswordProviders,
    {
      provide: 'POSTS_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(Post),
      inject: ['DATABASE_CONNECTION'],
    },
    ReactionsService,
    PostsService,
    FriendsService,
    UsersService,
  ],
  exports: [ReactionsService],
})
export class ReactionsModule {}
