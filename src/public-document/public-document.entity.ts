import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { Document } from '../document/document.entity';

@Entity()
export class PublicDocument {
    @OneToOne(() => Document, document => document.publicDocument)
    @JoinColumn({ name: "id" })
    document: Document;

    @PrimaryColumn()
    id: string;

    @Column()
    owner_id: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    public: boolean;

    @Column()
    updateAt: Date;
}  