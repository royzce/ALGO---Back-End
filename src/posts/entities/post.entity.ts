import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';

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
}
