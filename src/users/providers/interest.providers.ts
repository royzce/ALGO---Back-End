import { Connection } from 'typeorm';
import { Interest } from '../entities/interest.entity';

export const interestProviders = [
  {
    provide: 'INTEREST_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Interest),
    inject: ['DATABASE_CONNECTION'],
  },
];
