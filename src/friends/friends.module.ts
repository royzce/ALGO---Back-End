import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { userProfileProviders } from 'src/users/providers/userProfile.providers';
import { FriendsController } from './controller/friends/friends.controller';
import { friendProviders } from './providers/friend.provider';
import { FriendsService } from './service/friends/friends.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FriendsController],
  providers: [...friendProviders, ...userProfileProviders, FriendsService],
})
export class FriendsModule {}
