import { Post } from 'src/posts/entities/post.entity';
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Share {
  @PrimaryGeneratedColumn()
  shareId: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @Column()
  date: Date;

  @ManyToOne(() => Post, (post) => post.shares)
  @JoinColumn({ name: 'postId' })
  post: Post;
}
