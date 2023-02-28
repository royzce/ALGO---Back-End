import { UserProfile } from 'src/users/entities/userProfile.entity';
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  tagId: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @Column()
  taggedUsers: number;

  @ManyToOne(() => Post, (post) => post.tags)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => UserProfile, (post) => post.tag)
  @JoinColumn({ name: 'taggedUsers' })
  tagUser: UserProfile;
}
