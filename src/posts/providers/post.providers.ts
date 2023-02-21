import { Connection } from 'typeorm';
import { Post } from '../entities/post.entity';

export const postProviders = [
  {
    provide: 'POST_REPOSITORY',
    userFactory: (connection: Connection) => connection.getRepository(Post),
    inject: ['DATABASE_CONNECTION'],
  },
];
