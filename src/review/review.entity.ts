import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    JoinColumn,
} from 'typeorm';
import { Document } from '../document/document.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

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

    @Column({ nullable: true })
    document_id: string;

    @ManyToMany(() => Document)
    @JoinColumn({ name: "document_id" })
    document: Document;

    @ManyToMany(() => Document, document => document.reviews)
    @JoinTable()
    documents: Document[];
}
