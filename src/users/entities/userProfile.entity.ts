import { Exclude } from 'class-transformer';
import { Friend } from 'src/friends/entities/friend.entity';
import { Comment } from 'src/posts/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';

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

  @Column()
  friends: string;

  @Column()
  interest: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Friend, (friend) => friend.user)
  friend: Friend[];

  //Commented out to fix database constraint
  // @OneToMany(() => Comment, (comment) => comment.userProfile)
  // comment: Comment[];
}
