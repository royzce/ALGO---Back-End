import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Body, Delete, Put } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  DeleteNotifDto,
  UpdateNotifDto,
} from 'src/notifications/dtos/notification.dto';
import { NotificationsService } from 'src/notifications/service/notifications/notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Get()
  getNotifs(@Request() req) {
    return this.notificationService.getNotification(req.user.userId);
  }

  @Delete('/delete')
  deleteNotification(@Body() deleteNotifDto: DeleteNotifDto) {
    return this.notificationService.deleteNotification(deleteNotifDto);
  }

  @Put('/update')
  updateNotification(@Body() UpdateNotifDto: UpdateNotifDto) {
    return this.notificationService.updateNotification(UpdateNotifDto);
  }
}
