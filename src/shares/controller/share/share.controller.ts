import { Controller, Request } from '@nestjs/common';
import { Body, Post, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SharePostDto } from 'src/shares/dtos/sharePost.dto';
import { ShareService } from 'src/shares/service/share/share.service';

@Controller('share')
export class ShareController {
  constructor(private shareService: ShareService) {}
  //add @Request() and Guard

  @Post()
  @UseGuards(JwtAuthGuard)
  sharePost(@Body() sharePostDto: SharePostDto, @Request() req) {
    return this.shareService.sharePost(sharePostDto, req.user.userId);
  }
}
