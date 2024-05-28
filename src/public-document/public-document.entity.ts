import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}
