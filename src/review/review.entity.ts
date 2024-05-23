import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    document_id: string;

    @Column()
    reviewer_id: string;

    @Column()
    reviewer_name: string;

    @Column('text')
    comment: string;

    @Column({
        enum: ['pass', 'reject'],
    })
    status: string;

    @Column()
    createAt: Date;
}
