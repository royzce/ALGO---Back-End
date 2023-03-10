import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddReactionDto } from 'src/reactions/dtos/addReaction.dto';
import { RemoveReactionDto } from 'src/reactions/dtos/removeReaction.dto';
import { UpdateReactionDto } from 'src/reactions/dtos/updateReaction.dto';
import { ReactionsService } from 'src/reactions/service/reactions/reactions.service';

@Controller('reactions')
export class ReactionsController {
  constructor(private reactionService: ReactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addReaction(@Body() addReaction: AddReactionDto, @Request() req) {
    return this.reactionService.addReaction(addReaction, req.user.userId);
  }

  @Delete()
  deleteReaction(@Body() removeReactionDto: RemoveReactionDto) {
    return this.reactionService.removeReaction(removeReactionDto);
  }

  @Put()
  updateReaction(@Body() updateReactionDto: UpdateReactionDto) {
    return this.reactionService.updateReaction(updateReactionDto);
  }
}
