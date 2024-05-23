import { Inject, Injectable, Logger } from '@nestjs/common';
import { ICommentRepository } from './comment.interface';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/comment.dto';
@Injectable()
export class CommentService {
    constructor(
        @Inject(ICommentRepository)
        private readonly commentRepository: ICommentRepository,
        private readonly logger: Logger,
    ) {
        this.logger = new Logger(CommentService.name);
    }

    async getComments(): Promise<Comment[]> {
        this.logger.log(`Get Comments`);
        return await this.commentRepository.findAll();
    }
    async createComment(body: CreateCommentDto): Promise<string> {
        this.logger.log(`Create Comment`);
        const comment = this.commentRepository.create(body);
        const result = await this.commentRepository.save(comment);

        return `Comment created: ${result.id}`;
    }

    async updateComment(commentId: string, body: CreateCommentDto): Promise<string> {
        this.logger.log(`Update Comment`);
        const comment = await this.commentRepository.findOneById(commentId);
        if (!comment) {
            return 'Comment not found';
        }

        const updatedComment = this.commentRepository.create(body);
        updatedComment.id = commentId;
        await this.commentRepository.save(updatedComment);

        return `Comment updated: ${commentId}`;
    }

    async deleteComment(commentId: string): Promise<string> {
        this.logger.log(`Delete Comment`);
        const comment = await this.commentRepository.findOneById(commentId);
        if (!comment) {
            return 'Comment not found';
        }

        await this.commentRepository.remove(comment);

        return `Comment deleted: ${commentId}`;
    }
}