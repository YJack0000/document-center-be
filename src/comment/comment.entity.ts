import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Document } from '../document/document.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => Document)
    @JoinColumn({ name: "document_id" })
    document_id: string;

    @ManyToMany(() => Document)
    @JoinColumn({ name: "document_id" })
    document: Document;

    @Column()
    user_id: string;

    @Column()
    user_name: string;

    @Column('text')
    content: string;

    @Column()
    createAt: Date;

    @ManyToMany(() => Document, document => document.comments)
    documents: Document[];
}
