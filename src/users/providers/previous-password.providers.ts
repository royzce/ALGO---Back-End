import { Connection } from 'typeorm';
import { PreviousPassword } from '../entities/previous-password';

export const previousPasswordProviders = [
  {
    provide: 'PREVIOUSPASS_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(PreviousPassword),
    inject: ['DATABASE_CONNECTION'],
  },
];
