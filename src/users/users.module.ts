import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './controllers/users/users.controller';
import { blacklistedTokensProviders } from './providers/blacklistedToken.providers';
import { interestProviders } from './providers/interest.providers';
import { userProfileProviders } from './providers/userProfile.providers';
import { UsersService } from './services/users/users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    ...interestProviders,
    ...userProfileProviders,
    ...blacklistedTokensProviders,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
