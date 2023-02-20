import { Controller, Get, Post, Delete } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get()
  getAllPosts() {
    return 'all Post';
  }

  @Post()
  addPost() {
    return 'add Post';
  }

  @Get('id')
  getPost() {
    return 'specific post';
  }

  @Delete('id')
  deletePost() {
    return 'delete post';
  }

  @Get('/id/comments')
  comments() {
    return 'comments';
  }

  @Post('/id/comments')
  addComment() {
    return 'add comment';
  }

  @Delete('/id/comments/commentId')
  deleteComment() {
    return 'delet a comment';
  }
}
