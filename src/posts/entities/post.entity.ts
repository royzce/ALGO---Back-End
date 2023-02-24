import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Share } from 'src/shares/entities/share.entity';
import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Comment } from './comment.entity';
import { Media } from './media.entity';
import { Tag } from './tags.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  userId: number;

  @Column()
  isRepost: boolean;

  @Column()
  value: string;

  @Column()
  repostId: number;

  @Column()
  privacy: string;

  @Column()
  isEdited: boolean;

  @Column()
  date: Date;

  @ManyToOne(() => UserProfile, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: UserProfile;

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];

  @OneToMany(() => Media, (media) => media.post)
  media: Media[];

  @OneToMany(() => Share, (share) => share.post)
  shares: Share[];

  @OneToMany(() => Tag, (tag) => tag.post)
  tags: Tag[];
}
