import { Connection } from 'typeorm';
import { Tag } from '../entities/tags.entity';

export const tagProviders = [
  {
    provide: 'TAG_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Tag),
    inject: ['DATABASE_CONNECTION'],
  },
];
