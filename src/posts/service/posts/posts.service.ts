import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AddCommentDto } from 'src/posts/dtos/addComment.dto';
import { CreatePostDto } from 'src/posts/dtos/createPost.dto';
import { Comment } from 'src/posts/entities/comment.entity';
import { Media } from 'src/posts/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POSTS_REPOSITORY')
    private postRepository: Repository<Post>,
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
    @Inject('REACTION_REPOSITORY')
    private reactionRepository: Repository<Reaction>,
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: Repository<Comment>,
  ) {}

  async createNewPost(createPostDto: CreatePostDto, userId: number) {
    let post = new Post();
    // let media = new Media();

    post.userId = userId;
    post.isRepost = createPostDto.isRepost;
    post.value = createPostDto.value;
    post.repostId = createPostDto.repostId;
    post.privacy = createPostDto.privacy;
    post.tags = createPostDto.tags;
    post.date = createPostDto.date;
    post.isEdited = createPostDto.isEdited;

    post = await this.postRepository.save(post);
  }

  async getAllPost() {
    const allPosts = await this.postRepository.find({
      relations: ['user', 'comment', 'reactions'],
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

  async getComments(id: number) {
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

  async getPost(id: number) {
    const post = await this.postRepository.findOne({
      where: { postId: id },
      relations: ['user', 'comment', 'reactions'],
    });
    return post;
  }
}
