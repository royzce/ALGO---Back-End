import { Connection } from 'typeorm';
import { BlackListedToken } from '../entities/blacklistedToken.entity';

export const blacklistedTokensProviders = [
  {
    provide: 'BLACKLISTEDTOKEN_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(BlackListedToken),
    inject: ['DATABASE_CONNECTION'],
  },
];
