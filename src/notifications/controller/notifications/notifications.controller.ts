import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotificationsService } from 'src/notifications/service/notifications/notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Get()
  getNotifs(@Request() req) {
    return this.notificationService.getNotification(req.user.userId);
  }

  @Get('count')
  getNotifCount(@Request() req) {
    return this.notificationService.getNotificationCnt(req.user.userId);
  }
}
