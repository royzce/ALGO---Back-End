import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { postProviders } from 'src/posts/providers/post.providers';
import { postMediaProviders } from 'src/posts/providers/postMedia.providers';
import { interestProviders } from 'src/users/providers/interest.providers';
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
    ...postProviders,
    ProfilesService,
    UsersService,
  ],
})
export class ProfilesModule {}
