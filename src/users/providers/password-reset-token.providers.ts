import { Connection } from 'typeorm';
import { PasswordResetToken } from '../entities/password-reset-token.entity';

export const passwordResetTokenProviders = [
  {
    provide: 'BLACKLISTEDTOKEN_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(PasswordResetToken),
    inject: ['DATABASE_CONNECTION'],
  },
];
