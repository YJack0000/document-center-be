import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class PublicDocument {
  @PrimaryColumn()
  id: string;

  @Column()
  ownerId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  updateAt: Date;

  @Column({ default: false })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.publicDocuments)
  @JoinColumn({ name: 'ownerId' })
  owner: User;
}
