import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Review } from '../review/review.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  ownerId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({
    enum: ['edit', 'review', 'reject', 'pass'],
  })
  status: string;

  @Column()
  updateAt: Date;

  @Column()
  createAt: Date;

  @ManyToMany(() => Review, review => review.documents)
  reviews: Review[];

  @ManyToMany(() => Comment, comment => comment.documents)
  @JoinTable()
  comments: Comment[];
}
