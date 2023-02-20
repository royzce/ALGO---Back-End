import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProfilesModule,
    CommentsModule,
    ReactionsModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
