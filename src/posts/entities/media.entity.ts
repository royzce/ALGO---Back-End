import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  mediaId: number;

  @Column()
  postId: number;

  @Column()
  mediaLink: string;
}
