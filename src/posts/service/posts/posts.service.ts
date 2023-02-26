import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AddCommentDto } from 'src/posts/dtos/addComment.dto';
import { CreatePostDto } from 'src/posts/dtos/createPost.dto';
import { EditCommentDto } from 'src/posts/dtos/editComment.dto';
import { EditPostDto } from 'src/posts/dtos/editPost.dto';
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
  ) {}

  async createNewPost(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<Post> {
    let post = new Post();

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
      throw new InternalServerErrorException();
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
      });
    }

    return post;
  }

  async getAllPost(): Promise<Post[]> {
    const allPosts = await this.postRepository.find({
      relations: ['tags', 'shares', 'media', 'user', 'comment', 'reactions'],
    });

    return allPosts;
  }

  async addComment(
    id,
    addCommentDto: AddCommentDto,
    userId: number,
  ): Promise<Comment[]> {
    const post = await this.postRepository.findOne({ where: { postId: id } });
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

    return this.getComments(id);
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
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    await this.commentRepository.remove(comment);
    return comment;
  }

  async getPost(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { postId: id },
      relations: ['tags', 'shares', 'media', 'user', 'comment', 'reactions'],
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
  ): Promise<Comment[]> {
    let user = await this.userProfileRepository.findOne({
      where: { userId: userId },
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

    return this.getComments(postId);
  }
}
