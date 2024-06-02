import { Review } from 'src/review/review.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({
    enum: ['edit', 'review', 'reject', 'pass', 'delete'],
  })
  status: string;

  @Column()
  updateAt: Date;

  @Column()
  createAt: Date;

  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  reviews: Review[];
}
