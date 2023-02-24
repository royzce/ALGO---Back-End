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
  taggedUsers: string;

  @ManyToOne(() => Post, (post) => post.tags)
  @JoinColumn({ name: 'postId' })
  post: Post;
}
