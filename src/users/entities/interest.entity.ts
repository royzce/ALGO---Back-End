import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './userProfile.entity';

@Entity()
export class Interest {
  @PrimaryGeneratedColumn()
  interestId: number;

  @Column()
  userId: number;

  @Column()
  interest: string;

  @ManyToOne(() => UserProfile, (user) => user.interest)
  @JoinColumn({ name: 'userId' })
  user: UserProfile;
}
