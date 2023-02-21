import { Connection } from 'typeorm';
import { Media } from '../entities/media.entity';

export const postMediaProviders = [
  {
    provide: 'POSTMEDIA_REPOSITORY',
    userFactory: (connection: Connection) => connection.getRepository(Media),
    inject: ['DATABASE_CONNECTION'],
  },
];
