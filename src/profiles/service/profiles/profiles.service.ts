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

  async findProfile(_username) {
    let profile = await this.userProfileRepository.findOne({
      where: { username: _username },
    });

    return profile;
  }

  async getProfilePost(_username) {
    let profile = await this.userProfileRepository.find({
      where: { username: _username },
      relations: ['posts', 'comment', 'posts.reactions'],
    });

    return profile;
  }
}
