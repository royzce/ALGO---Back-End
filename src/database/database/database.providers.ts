import { Media } from 'src/posts/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
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
        entities: [Post, UserProfile, Media],
        synchronize: true,
      }),
  },
];
