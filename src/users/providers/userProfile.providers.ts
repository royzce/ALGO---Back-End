import { Connection } from 'typeorm';
import { UserProfile } from '../entities/userProfile.entity';

export const userProfileProviders = [
  {
    provide: 'USERPROFILE_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(UserProfile),
    inject: ['DATABASE_CONNECTION'],
  },
];
