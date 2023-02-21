import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/posts/dtos/createPost.dto';
import { PostMediaDto } from 'src/posts/dtos/postMedia.dto';
import { Media } from 'src/posts/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POSTS_REPOSITORY')
    private postRepository: Repository<Post>,
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async createNewPost(createPostDto: CreatePostDto) {
    let post = new Post();
    let media = new Media();

    post.userId = createPostDto.userId;
    post.value = createPostDto.value;
    post.privacy = createPostDto.privacy;
    post.tags = createPostDto.tags;
    post.date = createPostDto.date;
    post.isRepost = createPostDto.isRepost;

    post = await this.postRepository.save(post);
  }

  async getAllPost(): Promise<
    {
      firstName: string;
      lastName: string;
      avatar: string;
      username: string;
      value: string;
      privacy: string;
      date: Date;
      tags: string;
      isRepost: boolean;
    }[]
  > {
    const users = await this.userProfileRepository.find({
      relations: ['posts'],
    });

    const allPosts = users.flatMap((user) =>
      user.posts.map((post) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        username: user.username,
        value: post.value,
        privacy: post.privacy,
        date: post.date,
        tags: post.tags,
        isRepost: post.isRepost,
      })),
    );

    console.log(...allPosts);

    return allPosts;
  }
}
