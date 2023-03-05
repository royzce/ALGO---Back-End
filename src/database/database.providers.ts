import { Friend } from 'src/friends/entities/friend.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Comment } from 'src/posts/entities/comment.entity';
import { Media } from 'src/posts/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Tag } from 'src/posts/entities/tags.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Share } from 'src/shares/entities/share.entity';
import { PasswordResetToken } from 'src/users/entities/password-reset-token.entity';
import { Interest } from 'src/users/entities/interest.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { createConnection } from 'typeorm';
import { PreviousPassword } from 'src/users/entities/previous-password';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'sqlite',
        database: './algo.sqlite',
        entities: [
          Post,
          UserProfile,
          Media,
          Reaction,
          Comment,
          Share,
          Tag,
          Friend,
          Interest,
          Notification,
          PasswordResetToken,
          PreviousPassword,
        ],
        synchronize: true,
      }),
  },
];
