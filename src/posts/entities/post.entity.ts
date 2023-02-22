import { Reaction } from 'src/reactions/entities/reaction.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Comment } from './comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  userId: number;

  @Column()
  value: string;

  @Column()
  privacy: string;

  @Column()
  date: Date;

  @Column()
  tags: string;

  @Column()
  isRepost: boolean;

  @ManyToOne(() => UserProfile, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: UserProfile;

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];
}
