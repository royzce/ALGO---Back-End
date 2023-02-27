import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  email: string;

  @Column()
  tokenValue: string;

  @Column()
  exp: Date;
}
