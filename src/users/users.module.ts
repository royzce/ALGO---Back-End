import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './controllers/users/users.controller';
import { interestProviders } from './providers/interest.providers';
import { passwordResetTokenProviders } from './providers/password-reset-token.providers';
import { userProfileProviders } from './providers/userProfile.providers';
import { UsersService } from './services/users/users.service';
import { friendProviders } from 'src/friends/providers/friend.provider';
import { previousPasswordProviders } from './providers/previous-password.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    ...interestProviders,
    ...userProfileProviders,
    ...passwordResetTokenProviders,
    ...friendProviders,
    ...previousPasswordProviders,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
