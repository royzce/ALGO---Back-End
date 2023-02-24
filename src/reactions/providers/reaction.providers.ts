import { Connection } from 'typeorm';
import { Reaction } from '../entities/reaction.entity';

export const reactionProviders = [
  {
    provide: 'REACTION_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Reaction),
    inject: ['DATABASE_CONNECTION'],
  },
];
