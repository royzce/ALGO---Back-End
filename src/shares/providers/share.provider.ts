import { Connection } from 'typeorm';
import { Share } from '../entities/share.entity';

export const shareProviders = [
  {
    provide: 'SHARE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Share),
    inject: ['DATABASE_CONNECTION'],
  },
];
