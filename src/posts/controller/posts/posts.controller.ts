import {
  Controller,
  Get,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
} from '@nestjs/common';
import { Request, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddCommentDto } from 'src/posts/dtos/addComment.dto';
import { CreatePostDto } from 'src/posts/dtos/createPost.dto';
import { PostsService } from 'src/posts/service/posts/posts.service';

@Controller('posts')
@UsePipes(ValidationPipe)
export class PostsController {
  constructor(private postService: PostsService) {}

  @Get('/posts')
  getAllPosts(@Request() req) {
    console.log(req);
    return this.postService.getAllPost();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.createNewPost(createPostDto, req.user.userId);
  }

  @Get('/:id')
  getPost(@Param('id') id: number) {
    return this.postService.getPost(id);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }

  @Get('/:id/comments')
  getComments(@Param('id') id: number) {
    return this.postService.getComments(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/comments')
  addComment(
    @Param('id') id: number,
    @Body() addCommentDto: AddCommentDto,
    @Request() req,
  ) {
    return this.postService.addComment(id, addCommentDto, req.user.userId);
  }

  @Delete('/:id/comments/:commentId')
  deleteComment(
    @Param('id') id: number,
    @Param('commentId') commentId: number,
  ) {
    return this.postService.deleteComment(id, commentId);
  }
}
