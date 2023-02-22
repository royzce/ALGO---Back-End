import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from 'src/posts/entities/post.entity';
import { AddReactionDto } from 'src/reactions/dtos/addReaction.dto';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class ReactionsService {
  constructor(
    @Inject('REACTION_REPOSITORY')
    private reactionRepository: Repository<Reaction>,
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
  ) {}

  async addReaction(addReactionDto: AddReactionDto) {
    // const post = await this.postRepository.findOne({
    //   where: { postId: addReactionDto.postId },
    // }); // fetch post from the database
    // if (!post) {
    //   throw new NotFoundException(
    //     `Post with ID ${addReactionDto.postId} not found`,
    //   );
    // }
    let reaction = new Reaction();
    reaction.postId = addReactionDto.postId;
    reaction.value = addReactionDto.value;
    reaction.date = addReactionDto.date;
    reaction = await this.reactionRepository.save(reaction);
    return reaction;
  }
}
