import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { friendProviders } from 'src/friends/providers/friend.provider';
import { FriendsService } from 'src/friends/service/friends/friends.service';
import { notificationProviders } from 'src/notifications/providers/notifications.providers';
import { postProviders } from 'src/posts/providers/post.providers';
import { postMediaProviders } from 'src/posts/providers/postMedia.providers';
import { shareProviders } from 'src/shares/providers/share.provider';
import { interestProviders } from 'src/users/providers/interest.providers';
import { passwordResetTokenProviders } from 'src/users/providers/password-reset-token.providers';
import { previousPasswordProviders } from 'src/users/providers/previous-password.providers';
import { userProfileProviders } from 'src/users/providers/userProfile.providers';
import { UsersService } from 'src/users/services/users/users.service';
import { ProfilesController } from './controller/profiles/profiles.controller';
import { ProfilesService } from './service/profiles/profiles.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfilesController],
  providers: [
    ...interestProviders,
    ...postMediaProviders,
    ...userProfileProviders,
    ...passwordResetTokenProviders,
    ...postProviders,
    ...friendProviders,
    ...shareProviders,
    ...notificationProviders,
    ...previousPasswordProviders,
    ProfilesService,
    UsersService,
    FriendsService,
  ],
})
export class ProfilesModule {}
