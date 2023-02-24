import { Comment } from 'src/posts/entities/comment.entity';
import { Media } from 'src/posts/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Tag } from 'src/posts/entities/tags.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Share } from 'src/shares/entities/share.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { userProfileProviders } from 'src/users/providers/userProfile.providers';
import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'sqlite',
        database: './algo.sqlite',
        entities: [Post, UserProfile, Media, Reaction, Comment, Share, Tag],
        synchronize: true,
      }),
  },
];
