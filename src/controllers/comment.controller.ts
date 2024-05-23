import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CommentService } from '../comment/comment.service';
import { Comment } from '../comment/comment.entity';
import { CreateCommentDto } from 'src/comment/dto/comment.dto';
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Get()
    async getComments(): Promise<Comment[]> {
        return await this.commentService.getComments();
    }
    @Post()
    async createComment(@Body() body: CreateCommentDto): Promise<string> {
        return await this.commentService.createComment(body);
    }
    @Put(':commentId')
    async updateComment(
        @Param('commentId') commentId: string,
        @Body() body: CreateCommentDto,
    ): Promise<string> {
        return await this.commentService.updateComment(commentId, body);
    }

    @Delete(':commentId')
    async deleteComment(@Param('commentId') commentId: string): Promise<string> {
        return await this.commentService.deleteComment(commentId);
    }
}