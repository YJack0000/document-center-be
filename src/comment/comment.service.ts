import { Injectable, Inject, Logger } from '@nestjs/common';
import { ICommentRepository } from './comment.interface';
import { CreateCommentDto, GetCommentDto } from './dto/comment.dto';
import { UserReq } from 'src/strategy/jwt.strategy';
import { Comment } from './comment.entity';
import { DeepPartial } from 'typeorm';
import { PaginationResDto } from 'src/common/pagination.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject(ICommentRepository)
    private readonly commentRepository: ICommentRepository,
    private readonly logger: Logger,
  ) {}

  async getAllComments(
    query: GetCommentDto,
  ): Promise<PaginationResDto<Comment>> {
    this.logger.log(`Create Comment`);
    const { documentId, page, limit } = query;
    const totalAmount = await this.commentRepository.count({
      where: { documentId },
    });
    const data = await this.commentRepository.findAll({
      relations: ['user'],
      where: { documentId },
      select: {
        id: true,
        documentId: true,
        content: true,
        createAt: true,
        user: {
          id: true,
          name: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(totalAmount / limit),
    };
  }

  async createComment(user: UserReq, body: CreateCommentDto) {
    this.logger.log(`Create Comment`);
    const { documentId, content } = body;
    const { id, name } = user;

    const comment: DeepPartial<Comment> = {
      documentId,
      content,
      userId: id,
    };

    const newComment = this.commentRepository.create(comment);
    return await this.commentRepository.save(newComment);
  }
}
