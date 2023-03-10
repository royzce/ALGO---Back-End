import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { notificationProviders } from 'src/notifications/providers/notifications.providers';
import { userProfileProviders } from 'src/users/providers/userProfile.providers';
import { FriendsController } from './controller/friends/friends.controller';
import { friendProviders } from './providers/friend.provider';
import { FriendsService } from './service/friends/friends.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FriendsController],
  providers: [
    ...notificationProviders,
    ...friendProviders,
    ...userProfileProviders,
    FriendsService,
  ],
})
export class FriendsModule {}
