import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PreviousPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  previousPassword: string;
}
