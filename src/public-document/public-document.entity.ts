import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from '../document/document.entity';
Entity()
export class PublicDocument {
    @OneToOne(() => Document)
    @JoinColumn({ name: "id" })
    document: Document;

    @PrimaryColumn()
    id: string;

    @Column()
    ownerId: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    public: boolean;

    @Column()
    updateAt: Date;
}