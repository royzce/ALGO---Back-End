import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover: string;

  //   @OneToMany(() => Todo, (todo) => todo.user)
  //   todos: Todo[];
}
