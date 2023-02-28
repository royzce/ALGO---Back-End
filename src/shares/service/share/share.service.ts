import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Post } from 'src/posts/entities/post.entity';
import { SharePostDto } from 'src/shares/dtos/sharePost.dto';
import { Share } from 'src/shares/entities/share.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class ShareService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
    @Inject('SHARE_REPOSITORY')
    private shareRepository: Repository<Share>,
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
  ) {}

  async sharePost(sharePostDto: SharePostDto, userId: number) {
    const post = await this.postRepository.findOne({
      where: { postId: sharePostDto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post Not Found');
    }

    let share = new Share();
    share.postId = sharePostDto.postId;
    share.date = sharePostDto.date;
    share.userId = userId;

    let sharedPost = new Post();
    sharedPost.userId = userId;
    sharedPost.isRepost = true;
    sharedPost.value = post.value;
    sharedPost.repostId = post.postId;
    sharedPost.privacy = post.privacy;
    sharedPost.date = post.date;
    sharedPost.isEdited = post.isEdited;

    let notification = new Notification();
    notification.notifFrom = userId;
    notification.isRead = false;
    notification.type = 'share';
    notification.typeId = post.postId;
    notification.userId = post.userId;
    notification.date = sharePostDto.date;

    try {
      sharedPost = await this.postRepository.save(sharedPost);
      share = await this.shareRepository.save(share);
      notification = await this.notificationRepository.save(notification);
    } catch (error) {
      throw new HttpException('Share Failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return 'Post Shared!';
  }
}
