import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from 'src/posts/service/posts/posts.service';
import { AddReactionDto } from 'src/reactions/dtos/addReaction.dto';
import { RemoveReactionDto } from 'src/reactions/dtos/removeReaction.dto';
import { UpdateReactionDto } from 'src/reactions/dtos/updateReaction.dto';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class ReactionsService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
    @Inject('REACTION_REPOSITORY')
    private reactionRepository: Repository<Reaction>,
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
    private postService: PostsService,
  ) {}

  async addReaction(
    addReactionDto: AddReactionDto,
    userId: number,
  ): Promise<Reaction> {
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

    let notifExist = await this.notificationRepository.findOne({
      where: { type: 'reaction', typeId: addReactionDto.postId, isRead: false },
    });

    if (notifExist) {
      notifExist.type = 'reaction';
      notifExist.userId = post.userId;
      notifExist.date = addReactionDto.date;
      notifExist.notifFrom = userId;
      notifExist.isRead = false;
      notifExist.typeId = reaction.postId;
      notifExist.count = notifExist.count + 1;

      notifExist = await this.notificationRepository.save(notifExist);
    } else {
      let notif = new Notification();
      notif.type = 'reaction';
      notif.userId = post.userId;
      notif.date = reaction.date;
      notif.notifFrom = userId;
      notif.isRead = false;
      notif.typeId = reaction.postId;
      notif.count = 1;

      try {
        notif = await this.notificationRepository.save(notif);
      } catch (error) {
        throw new HttpException(
          'Failed saving notification',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return reaction;
  }

  async removeReaction(removeReaction: RemoveReactionDto): Promise<Reaction> {
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
    return reaction;
  }

  async updateReaction(
    updateReactionDto: UpdateReactionDto,
  ): Promise<Reaction> {
    const post = await this.postRepository.findOne({
      where: { postId: updateReactionDto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not Found');
    }

    let reaction = await this.reactionRepository.findOne({
      where: { postId: updateReactionDto.postId },
    });

    if (!reaction) {
      throw new NotFoundException('No current user reaction');
    }

    reaction.value = updateReactionDto.value || reaction.value;

    try {
      reaction = await this.reactionRepository.save(reaction);
    } catch (error) {
      throw new HttpException(
        'Update reaction failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return reaction;
  }
}
