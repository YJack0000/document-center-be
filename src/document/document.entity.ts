import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
