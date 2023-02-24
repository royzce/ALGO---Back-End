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
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POSTMEDIA_REPOSITORY')
    private postMediaRepository: Repository<Media>,
    @Inject('POSTS_REPOSITORY')
    private postRepository: Repository<Post>,
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
    // @Inject('REACTION_REPOSITORY')
    // private reactionRepository: Repository<Reaction>,
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: Repository<Comment>,
  ) {}

  async createNewPost(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<Post> {
    let post = new Post();
    let media = new Media();

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
        media.userId = userId;
        media.postId = post.postId;
        media.mediaLink = m;
        try {
          await this.postMediaRepository.save(media);
        } catch (error) {
          throw new InternalServerErrorException();
        }
      });
    }

    return post;
  }

  async getAllPost(): Promise<Post[]> {
    const allPosts = await this.postRepository.find({
      relations: ['shares', 'media', 'user', 'comment', 'reactions'],
    });

    return allPosts;
  }

  async addComment(id, addCommentDto: AddCommentDto, userId: number) {
    const post = await this.postRepository.findOne({ where: { postId: id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    console.log(post);

    let comment = new Comment();

    comment.value = addCommentDto.value;
    comment.replyTo = addCommentDto.replyTo;
    comment.isEdited = addCommentDto.isEdited;
    comment.date = addCommentDto.date;
    comment.postId = id;
    comment.userId = userId;
    comment = await this.commentRepository.save(comment);

    return comment;
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { postId: id },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    await this.postRepository.remove(post);
    return { ...post, id };
  }

  async getComments(id: number): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { postId: id },
      relations: ['userProfile'],
    });

    return comments;
  }

  async deleteComment(id: number, commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { postId: id, commentId: commentId },
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
      relations: ['media', 'user', 'comment', 'reactions'],
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
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    post.date = editPostDto.date || post.date;
    post.privacy = editPostDto.privacy || post.privacy;
    post.value = editPostDto.value || post.value;
    post.isEdited = true;

    post.isRepost = editPostDto.isRepost || post.isRepost;

    post = await this.postRepository.save(post);
    console.log(user);

    console.log(post);

    return 'saved';
  }

  async editComment(
    userId: number,
    postId: number,
    commentId: number,
    editCommentDto: EditCommentDto,
  ) {
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
  }
}
