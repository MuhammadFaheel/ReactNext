import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'User', schema: 'dbo' })
export class User {
  @PrimaryGeneratedColumn()
  Id: number | undefined;

  @Column()
  Email: string | undefined;

  @Column()
  Password: string | undefined;

  @Column()
  Name: string | undefined;
}