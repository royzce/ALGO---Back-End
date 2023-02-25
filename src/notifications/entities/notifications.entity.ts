import { Column, PrimaryGeneratedColumn } from 'typeorm';
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
  value: string;

  @Column()
  isRead: boolean;

  @Column()
  date: Date;
}
