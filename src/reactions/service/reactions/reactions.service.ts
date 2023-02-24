import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from 'src/posts/entities/post.entity';
import { AddReactionDto } from 'src/reactions/dtos/addReaction.dto';
import { RemoveReactionDto } from 'src/reactions/dtos/removeReaction.dto';
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

  async addReaction(addReactionDto: AddReactionDto, userId: number) {
    const post = await this.postRepository.findOne({
      where: { postId: addReactionDto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not Found');
    }

    let reaction = new Reaction();
    reaction.postId = addReactionDto.postId;
    reaction.userId = userId;
    reaction.value = addReactionDto.value;
    reaction.date = addReactionDto.date;
    reaction = await this.reactionRepository.save(reaction);
    return reaction;
  }

  async removeReaction(removeReaction: RemoveReactionDto) {
    const post = await this.postRepository.findOne({
      where: { postId: removeReaction.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not Found');
    }

    let reaction = await this.reactionRepository.findOne({
      where: { postId: removeReaction.postId },
    });

    if (!reaction) {
      throw new NotFoundException('No current user reaction');
    }

    await this.reactionRepository.remove(reaction);
    return 'reaction removed';
  }
}
