import { UserProfile } from 'src/users/entities/userProfile.entity';
import {
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  notifId: number;

  @Column()
  userId: number;

  @Column()
  type: string;

  @Column()
  typeId: number;

  @Column()
  notifFrom: number;

  @Column()
  isRead: boolean;

  @Column()
  date: Date;

  @ManyToOne(() => UserProfile, (user) => user.notification)
  @JoinColumn({ name: 'notifFrom' })
  from: UserProfile;
}
