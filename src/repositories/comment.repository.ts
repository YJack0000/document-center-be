import { Injectable } from '@nestjs/common';
import { BaseRepostitory } from '../common/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Comment } from 'src/comment/comment.entity';
import { ICommentRepository } from 'src/comment/comment.interface';

@Injectable()
export class CommentRepository
  extends BaseRepostitory<Comment>
  implements ICommentRepository
{
  constructor(
    @InjectRepository(Comment)
    commentRepository: Repository<Comment>,
  ) {
    super(commentRepository);
  }

  public create(data: DeepPartial<Comment>): Comment {
    const comment = {
      ...data,
      createAt: new Date(),
    };
    return super.create(comment);
  }
}
