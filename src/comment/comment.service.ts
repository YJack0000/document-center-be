import { Injectable, Inject, Logger } from '@nestjs/common';
import { ICommentRepository } from './comment.interface';
import { CreateCommentDto, GetCommentDto } from './dto/comment.dto';
import { UserReq } from 'src/strategy/jwt.strategy';
import { Comment } from './comment.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @Inject(ICommentRepository)
    private readonly commentRepository: ICommentRepository,
    private readonly logger: Logger,
  ) {}

  async getAllComments(query: GetCommentDto) {
    this.logger.log(`Create Comment`);
    const { documentId } = query;
    return await this.commentRepository.findManyByCondition({
      where: { documentId },
    });
  }

  async createComment(user: UserReq, body: CreateCommentDto) {
    this.logger.log(`Create Comment`);
    const { documentId, content } = body;
    const { id, name } = user;

    const comment: DeepPartial<Comment> = {
      documentId,
      content,
      userId: id,
      username: name,
    };

		const newComment = this.commentRepository.create(comment);
		return await this.commentRepository.save(newComment);
  }
}
