import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    document_id: string;

    @Column()
    user_id: string;

    @Column()
    user_name: string;

    @Column('text')
    content: string;

    @Column()
    createAt: Date;
}
