import { Post } from 'src/posts/entities/post.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  reactionId: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @Column()
  value: string;

  @Column()
  date: Date;

  @ManyToOne(() => Post, (post) => post.reactions)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => UserProfile, (user) => user.reactions)
  @JoinColumn({ name: 'userId' })
  user: UserProfile;
}
