import { UserProfile } from 'src/users/entities/userProfile.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  friendId: number;

  @Column()
  status: string;

  @ManyToOne(() => UserProfile, (user) => user.friends)
  @JoinColumn({ name: 'userId' })
  user: UserProfile;
}
