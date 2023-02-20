import { Controller, Post } from '@nestjs/common';

@Controller('reactions')
export class ReactionsController {
  @Post()
  reaction() {
    return 'liked!';
  }
}
