import {
  Controller,
  Get,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Put, Request, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddCommentDto } from 'src/posts/dtos/addComment.dto';
import { CreatePostDto } from 'src/posts/dtos/createPost.dto';
import { EditCommentDto } from 'src/posts/dtos/editComment.dto';
import { EditPostDto } from 'src/posts/dtos/editPost.dto';
import { EditPrivacyDto } from 'src/posts/dtos/editPrivacy.dto';
import { PostsService } from 'src/posts/service/posts/posts.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('posts')
@UsePipes(ValidationPipe)
export class PostsController {
  constructor(private postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllPosts(@Request() req) {
    return this.postService.getAllPost(req.user.userId);
  }

  @Post()
  addPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.createNewPost(createPostDto, req.user.userId);
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
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

  @Put('/:id/editPrivacy')
  editPrivacy(
    @Param('id') postId: number,
    @Body() editPrivacyDto: EditPrivacyDto,
    @Request() req,
  ) {
    return this.postService.updatePrivacy(
      req.user.userId,
      postId,
      editPrivacyDto,
    );
  }

  @Put('/:id/edit')
  editPost(
    @Param('id') postId: number,
    @Request() req,
    @Body() editPostDto: EditPostDto,
  ) {
    return this.postService.editPost(req.user.userId, postId, editPostDto);
  }

  @Put('/:id/comments/:commentId/edit')
  editComment(
    @Param('id') postId: number,
    @Param('commentId') commentId: number,
    @Request() req,
    @Body() editComment: EditCommentDto,
  ) {
    return this.postService.editComment(
      req.user.userId,
      postId,
      commentId,
      editComment,
    );
  }
}
