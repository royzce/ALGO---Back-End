import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { postProviders } from 'src/posts/providers/post.providers';
import { userProfileProviders } from 'src/users/providers/userProfile.providers';
import { ProfilesController } from './controller/profiles/profiles.controller';
import { ProfilesService } from './service/profiles/profiles.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfilesController],
  providers: [...userProfileProviders, ...postProviders, ProfilesService],
})
export class ProfilesModule {}
