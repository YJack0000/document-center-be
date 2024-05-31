import { Comment } from 'src/comment/comment.entity';
import { Document } from 'src/document/document.entity';
import { PublicDocument } from 'src/public-document/public-document.entity';
import { Review } from 'src/review/review.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string; // oauth_id

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: false })
  isSuperUser: boolean;

  @Column()
  createAt: Date;

  comments: Comment[];
  documents: Document[];
  publicDocuments: PublicDocument[];
  reviews: Review[];
}
