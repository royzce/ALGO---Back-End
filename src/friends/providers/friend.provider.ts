import { Connection } from 'typeorm';
import { Friend } from '../entities/friend.entity';

export const friendProviders = [
  {
    provide: 'FRIEND_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Friend),
    inject: ['DATABASE_CONNECTION'],
  },
];
