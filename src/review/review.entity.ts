import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentId: string;

  @Column()
  reviewerId: string;

  @Column({ default: '' })
  comment: string;

  @Column({
    enum: ['pass', 'reject', 'wait', 'transfer'],
    default: 'wait',
  })
  status: string;

  @ManyToOne(() => User, (user) => user.reviews) 
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User; 
}
