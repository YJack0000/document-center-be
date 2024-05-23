import { Logger, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from '../controllers/comment.controller';
import { CommentRepository } from 'src/repositories/comment.repository';
import { ICommentRepository } from './comment.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment])],
    providers: [
        CommentService,
        {
            provide: ICommentRepository,
            useClass: CommentRepository,
        },
        Logger,
    ],
    controllers: [CommentController],
})
export class CommentModule { }