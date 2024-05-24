import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne
} from 'typeorm';
import { Review } from '../review/review.entity';
import { Comment } from '../comment/comment.entity';
import { PublicDocument } from '../public-document/public-document.entity';

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
    enum: ['review', 'reject', 'pass', 'edit'],
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

  @OneToOne(() => PublicDocument, publicDocument => publicDocument.document)
  publicDocument: PublicDocument;
}