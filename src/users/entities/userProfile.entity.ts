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
  password: string;

  @Column()
  avatar: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  // @Column()
  // cover: string;

  // @Column()
  // bio: string;

  // @Column()
  // interest: string;
}
