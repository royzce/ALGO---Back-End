import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddReactionDto } from 'src/reactions/dtos/addReaction.dto';
import { ReactionsService } from 'src/reactions/service/reactions/reactions.service';

@Controller('reactions')
export class ReactionsController {
  constructor(private reactionService: ReactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  reaction(@Body() addReaction: AddReactionDto, @Request() req) {
    return this.reactionService.addReaction(addReaction, req.user.userId);
  }
}
