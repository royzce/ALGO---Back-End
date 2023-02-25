import { Exclude } from 'class-transformer';
import { Friend } from 'src/friends/entities/friend.entity';
import { Comment } from 'src/posts/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { Interest } from './interest.entity';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @Column()
  cover: string;

  @Column()
  bio: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Friend, (friend) => friend.user)
  friends: Friend[];

  @OneToMany(() => Interest, (_interest) => _interest.user)
  interest: Interest[];
}
