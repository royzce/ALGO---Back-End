import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlackListedToken {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  tokenValue: string;

  @Column()
  exp: Date;
}
