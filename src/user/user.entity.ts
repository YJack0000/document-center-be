import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  oauthId: string;

  @Column()
  createAt: Date;
}
