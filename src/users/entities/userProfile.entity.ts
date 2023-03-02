import { Exclude } from 'class-transformer';
import { Friend } from 'src/friends/entities/friend.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Comment } from 'src/posts/entities/comment.entity';
import { Media } from 'src/posts/entities/media.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Tag } from 'src/posts/entities/tags.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Share } from 'src/shares/entities/share.entity';
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

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Share, (share) => share.user)
  share: Share[];

  @OneToMany(() => Notification, (notification) => notification.from)
  notification: Notification[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tag: Tag[];

  @OneToMany(() => Media, (media) => media.user)
  media: Media[];
}
