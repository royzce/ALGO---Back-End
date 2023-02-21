import {
  Controller,
  Get,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { AddCommentDto } from 'src/posts/dtos/addComment.dto';
import { CreatePostDto } from 'src/posts/dtos/createPost.dto';
import { PostMediaDto } from 'src/posts/dtos/postMedia.dto';
import { PostsService } from 'src/posts/service/posts/posts.service';

@Controller('posts')
@UsePipes(ValidationPipe)
export class PostsController {
  constructor(private postService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPost();
  }

  @Post()
  addPost(@Body() createPostDto: CreatePostDto) {
    console.log('created');
    return this.postService.createNewPost(createPostDto);
  }

  @Get(':id')
  getPost() {
    return 'specific post';
  }

  @Delete(':id')
  deletePost() {
    return 'delete post';
  }

  @Get('/:id/comments')
  comments() {
    return 'comments';
  }

  @Post('/:id/comments')
  @UsePipes(ValidationPipe)
  addComment(@Body() addCommentDto: AddCommentDto) {
    return 'add comment';
  }

  @Delete('/:id/comments/:commentId')
  deleteComment() {
    return 'delet a comment';
  }
}
