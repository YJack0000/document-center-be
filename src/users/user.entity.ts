import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string; // oauth_id

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({default: false})
  isManager: boolean;

  @Column()
  createAt: Date;
}
