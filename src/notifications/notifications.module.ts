import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NotificationsController } from './controller/notifications/notifications.controller';
import { notificationProviders } from './providers/notifications.providers';
import { NotificationsService } from './service/notifications/notifications.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [...notificationProviders, NotificationsService],
})
export class NotificationsModule {}
