import { Injectable } from '@nestjs/common';
import { ICommentRepository } from 'src/comment/comment.interface';
import { BaseRepostitory } from '../common/base.repository';
import { Comment } from 'src/comment/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class CommentRepository
    extends BaseRepostitory<Comment>
    implements ICommentRepository {
    constructor(
        @InjectRepository(Comment)
        commentRepository: Repository<Comment>,
    ) {
        super(commentRepository);
    }
    public create(data: DeepPartial<Comment>): Comment {
        if (!data.createAt) {
            data.createAt = new Date();
        }
        return super.create(data);
    }
}