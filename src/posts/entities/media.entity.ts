import { UserProfile } from 'src/users/entities/userProfile.entity';
import {
  ManyToOne,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import {} from 'typeorm/decorator/relations/ManyToOne';
import { Post } from './post.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  mediaId: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @Column()
  mediaLink: string;

  @ManyToOne(() => Post, (post) => post.media)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => UserProfile, (user) => user.media)
  @JoinColumn({ name: 'userId' })
  user: UserProfile;
}
