import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ReactionsModule } from './reactions/reactions.module';
import { PostsModule } from './posts/posts.module';
import { MailerModule } from './mailer/mailer.module';
import { DatabaseModule } from './database/database.module';
import { SharesModule } from './shares/shares.module';
import { FriendsModule } from './friends/friends.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    MailerModule,
    AuthModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    ReactionsModule,
    PostsModule,
    DatabaseModule,
    SharesModule,
    FriendsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
