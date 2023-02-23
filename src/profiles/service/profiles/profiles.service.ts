import { Inject, Injectable } from '@nestjs/common';
import { profile } from 'console';
import { Post } from 'src/posts/entities/post.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('USERPROFILE_REPOSITORY')
    private userProfileRepository: Repository<UserProfile>,
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
  ) {}

  async findProfile(_username): Promise<UserProfile> {
    let profile = await this.userProfileRepository.findOne({
      where: { username: _username },
    });

    return profile;
  }

  async getProfilePost(_username): Promise<Post[]> {
    const user = await this.userProfileRepository.findOne({
      where: { username: _username },
    });

    const userId = user.userId;

    let profile = await this.postRepository.find({
      where: { userId: userId },
      relations: ['user', 'comment', 'reactions'],
    });

    return profile;
  }
}
