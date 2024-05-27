import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentId: string;

  @Column()
  reviewerId: string;

  @Column()
  reviewerName: string;

  @Column({ default: '' })
  comment: string;

  @Column({
    enum: ['pass', 'reject', 'wait'],
    default: 'wait',
  })
  status: string;
}
