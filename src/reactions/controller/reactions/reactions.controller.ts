import { Body, Controller, Post } from '@nestjs/common';
import { AddReactionDto } from 'src/reactions/dtos/addReaction.dto';

@Controller('reactions')
export class ReactionsController {
  @Post()
  reaction(@Body() addReaction: AddReactionDto) {
    return 'liked!';
  }
}
