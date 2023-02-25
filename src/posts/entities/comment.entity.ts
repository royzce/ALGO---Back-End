import { Reaction } from 'src/reactions/entities/reaction.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Post } from './post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @Column()
  value: string;

  @Column()
  replyTo: number;

  @Column()
  isEdited: boolean;

  @Column()
  date: Date;

  @ManyToOne(() => UserProfile, (user) => user.comment)
  @JoinColumn({ name: 'commentId' })
  userPofile: UserProfile;

  @ManyToOne(() => Post, (post) => post.comment)
  @JoinColumn({ name: 'postId' })
  post: Post;
}
