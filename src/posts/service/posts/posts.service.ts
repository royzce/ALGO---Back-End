import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Friend } from 'src/friends/entities/friend.entity';
import { FriendsService } from 'src/friends/service/friends/friends.service';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { AddCommentDto } from 'src/posts/dtos/addComment.dto';
import { CreatePostDto } from 'src/posts/dtos/createPost.dto';
import { EditCommentDto } from 'src/posts/dtos/editComment.dto';
import { EditPostDto } from 'src/posts/dtos/editPost.dto';
import { EditPrivacyDto } from 'src/posts/dtos/editPrivacy.dto';
import { Comment } from 'src/posts/entities/comment.entity';
import { Media } from 'src/posts/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Tag } from 'src/posts/entities/tags.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Share } from 'src/shares/entities/share.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
    @Inject('TAG_REPOSITORY')
    private tagRepository: Repository<Tag>,
    @Inject('POSTMEDIA_REPOSITORY')
    private postMediaRepository: Repository<Media>,
    @Inject('POSTS_REPOSITORY')
    private postRepository: Repository<Post>,
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: Repository<Comment>,
    @Inject('SHARE_REPOSITORY')
    private shareRepository: Repository<Share>,
    @Inject('REACTION_REPOSITORY')
    private reactionRepository: Repository<Reaction>,
    @Inject('FRIEND_REPOSITORY')
    private friendRepository: Repository<Friend>,
    private friendService: FriendsService,
  ) {}

  async createNewPost(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<Post> {
    let post = new Post();
    console.log('createpostdto', createPostDto);
    let postData = await this.postRepository.findOne({
      where: { postId: createPostDto.repostId },
    });

    if (createPostDto.isRepost === true) {
      let sharePost = new Share();
      console.log('sharepost', postData);
      sharePost.postId = postData.postId;
      sharePost.date = createPostDto.date;
      sharePost.userId = userId;

      sharePost = await this.shareRepository.save(sharePost);

      let notifExist = await this.notificationRepository.findOne({
        where: { type: 'share', typeId: postData.postId, isRead: false },
      });

      if (notifExist) {
        notifExist.type = 'share';
        notifExist.userId = postData.userId;
        notifExist.date = createPostDto.date;
        notifExist.notifFrom = userId;
        notifExist.isRead = false;
        notifExist.typeId = postData.postId;
        notifExist.count = notifExist.count + 1;

        notifExist = await this.notificationRepository.save(notifExist);
      } else {
        let notification = new Notification();
        notification.notifFrom = userId;
        notification.isRead = false;
        notification.type = 'share';
        notification.typeId = postData.postId;
        notification.userId = postData.userId;
        notification.date = createPostDto.date;
        notification.count = 1;

        notification = await this.notificationRepository.save(notification);
      }
    }

    post.userId = userId;
    post.isRepost = createPostDto.isRepost;
    post.value = createPostDto.value;
    post.repostId = createPostDto.repostId;
    post.privacy = createPostDto.privacy;
    post.date = createPostDto.date;
    post.isEdited = false;

    try {
      post = await this.postRepository.save(post);
    } catch (error) {
      throw new HttpException('failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (createPostDto.media) {
      createPostDto.media.forEach(async (m) => {
        let media = new Media();

        media.userId = userId;
        media.postId = post.postId;
        media.mediaLink = m;

        try {
          media = await this.postMediaRepository.save(media);
        } catch (error) {
          throw new InternalServerErrorException();
        }
      });
    }

    if (createPostDto.tags) {
      createPostDto.tags.forEach(async (t) => {
        let tag = new Tag();

        tag.userId = userId;
        tag.postId = post.postId;
        tag.taggedUsers = t;

        try {
          tag = await this.tagRepository.save(tag);
        } catch (error) {
          throw new HttpException('Cannot Tag', HttpStatus.FORBIDDEN);
        }

        let notifExist = await this.notificationRepository.findOne({
          where: { type: 'tag', typeId: post.postId, isRead: false },
        });

        if (notifExist) {
          notifExist.type = 'tag';
          notifExist.userId = t;
          notifExist.date = createPostDto.date;
          notifExist.notifFrom = userId;
          notifExist.isRead = false;
          notifExist.typeId = post.postId;
          notifExist.count = notifExist.count + 1;

          notifExist = await this.notificationRepository.save(notifExist);
        } else {
          let notification = new Notification();

          notification.type = 'tag';
          notification.isRead = false;
          notification.date = createPostDto.date;
          notification.notifFrom = userId;
          notification.userId = t;
          notification.typeId = post.postId;
          notification.count = 1;

          try {
            notification = await this.notificationRepository.save(notification);
          } catch (error) {
            throw new HttpException(
              'Failed saving notification',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
      });
    }

    return post;
  }

  async getAllPost(currentUserId: number): Promise<Post[]> {
    const allPosts = await this.postRepository.find({
      relations: [
        'tags',
        'tags.tagUser',
        'shares',
        'shares.user',
        'media',
        'user',
        'comment',
        'comment.user',
        'reactions',
        'reactions.user',
      ],
    });

    const friends = await this.friendService.getFriendList(currentUserId);
    let homePosts = [];
    for (const friend of friends) {
      const friendPosts = allPosts.filter(
        (post) => post.userId === friend.userId && post.privacy !== 'private',
      );
      homePosts.concat(friendPosts);
    }
    return homePosts;
  }

  async addComment(
    id,
    addCommentDto: AddCommentDto,
    userId: number,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({
      where: { postId: id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let comment = new Comment();

    comment.value = addCommentDto.value;
    comment.replyTo = addCommentDto.replyTo;
    comment.isEdited = addCommentDto.isEdited;
    comment.date = addCommentDto.date;
    comment.postId = id;
    comment.userId = userId;
    comment = await this.commentRepository.save(comment);

    const user = await this.userProfileRepository.findOne({
      where: { userId: userId },
    });
    comment.user = user;

    let notifExist = await this.notificationRepository.findOne({
      where: { type: 'comments', typeId: post.postId, isRead: false },
    });

    if (notifExist) {
      notifExist.type = 'comments';
      notifExist.userId = post.userId;
      notifExist.date = addCommentDto.date;
      notifExist.notifFrom = userId;
      notifExist.isRead = false;
      notifExist.typeId = post.postId;
      notifExist.count = notifExist.count + 1;

      notifExist = await this.notificationRepository.save(notifExist);
    }

    let notification = new Notification();

    notification.notifId = post.userId;
    notification.userId = post.userId;
    notification.type = 'comments';
    notification.date = addCommentDto.date;
    notification.isRead = false;
    notification.typeId = post.postId;
    notification.notifFrom = userId;
    notification.count = 1;

    try {
      notification = await this.notificationRepository.save(notification);
    } catch (error) {
      throw new HttpException(
        'Failed saving notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return comment;
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { postId: id },
      relations: ['tags', 'shares', 'media', 'comment', 'reactions'],
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    await Promise.all(post.tags.map((tag) => this.tagRepository.remove(tag)));
    await Promise.all(
      post.shares.map((share) => this.shareRepository.remove(share)),
    );
    await Promise.all(
      post.media.map((media) => this.postMediaRepository.remove(media)),
    );
    await Promise.all(
      post.comment.map((comment) => this.commentRepository.remove(comment)),
    );
    await Promise.all(
      post.reactions.map((reaction) =>
        this.reactionRepository.remove(reaction),
      ),
    );
    await this.postRepository.remove(post);
    return { ...post, id };
  }

  async getComments(id: number): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { postId: id },
      relations: ['user'],
    });

    return comments;
  }

  async deleteComment(id: number, commentId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { postId: id, commentId: commentId },
      relations: ['user'],
    });

    let repliedComment = await this.commentRepository.find({
      where: { replyTo: comment.commentId },
      relations: ['user'],
    });

    repliedComment = await this.commentRepository.remove(repliedComment);

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    await this.commentRepository.remove(comment);
    return comment;
  }

  async getPost(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { postId: id },
      relations: [
        'tags',
        'tags.tagUser',
        'shares',
        'shares.user',
        'media',
        'user',
        'comment',
        'comment.user',
        'reactions',
        'reactions.user',
      ],
    });

    return post;
  }

  async editPost(userId: number, _postId: number, editPostDto: EditPostDto) {
    let user = await this.userProfileRepository.findOne({
      where: { userId: userId },
    });

    if (!user) {
      throw new HttpException('Unable to edit', HttpStatus.UNAUTHORIZED);
    }

    let post = await this.postRepository.findOne({
      where: { postId: _postId },
      relations: ['media'],
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    post.date = editPostDto.date || post.date;
    post.privacy = editPostDto.privacy || post.privacy;
    post.value = editPostDto.value || post.value;
    post.isEdited = true;
    post.isRepost = editPostDto.isRepost || post.isRepost;

    await Promise.all(
      post.media.map((_media) => this.postMediaRepository.remove(_media)),
    );

    post = await this.postRepository.save(post);

    if (editPostDto.media) {
      for (const m of editPostDto.media) {
        let media = new Media();

        media.userId = userId;
        media.postId = post.postId;
        media.mediaLink = m;

        try {
          media = await this.postMediaRepository.save(media);
        } catch (error) {
          throw new InternalServerErrorException();
        }
      }
    }

    return this.getPost(_postId);
  }

  async editComment(
    userId: number,
    postId: number,
    commentId: number,
    editCommentDto: EditCommentDto,
  ): Promise<Comment> {
    let user = await this.userProfileRepository.findOne({
      where: { userId: userId },
      relations: ['user'],
    });

    if (!user) {
      throw new HttpException('Unable to edit', HttpStatus.UNAUTHORIZED);
    }

    let comment = await this.commentRepository.findOne({
      where: { postId: postId, commentId: commentId },
    });

    if (!comment) {
      throw new HttpException('Comment not Found', HttpStatus.BAD_REQUEST);
    }

    comment.value = editCommentDto.value || comment.value;
    comment.isEdited = true;

    try {
      comment = await this.commentRepository.save(comment);
    } catch (error) {
      throw new HttpException('Edit Failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return comment;
  }

  async updatePrivacy(
    _userId: number,
    _postId: number,
    editPrivacyDto: EditPrivacyDto,
  ) {
    const user = await this.userProfileRepository.findOne({
      where: { userId: _userId },
    });

    if (!user) {
      throw new HttpException(
        'Unable to update privacy',
        HttpStatus.UNAUTHORIZED,
      );
    }

    let post = await this.postRepository.findOne({
      where: { postId: _postId },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    post.privacy = editPrivacyDto.privacy || post.privacy;

    try {
      post = await this.postRepository.save(post);
    } catch (error) {
      throw new HttpException(
        'Unable to update privacy',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.getPost(_postId);
  }
}
