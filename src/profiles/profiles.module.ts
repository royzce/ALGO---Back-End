import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { friendProviders } from 'src/friends/providers/friend.provider';
import { postProviders } from 'src/posts/providers/post.providers';
import { postMediaProviders } from 'src/posts/providers/postMedia.providers';
import { shareProviders } from 'src/shares/providers/share.provider';
import { interestProviders } from 'src/users/providers/interest.providers';
import { passwordResetTokenProviders } from 'src/users/providers/password-reset-token.providers';
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
    ProfilesService,
    UsersService,
  ],
})
export class ProfilesModule {}
