import { Body, Controller, Post } from '@nestjs/common';
import { AddReactionDto } from 'src/reactions/dtos/addReaction.dto';
import { ReactionsService } from 'src/reactions/service/reactions/reactions.service';

@Controller('reactions')
export class ReactionsController {
  constructor(private reactionService: ReactionsService) {}

  @Post()
  reaction(@Body() addReaction: AddReactionDto) {
    return this.reactionService.addReaction(addReaction);
  }
}
