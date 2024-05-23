import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { ICommentRepository } from './comment.interface';
import { Logger } from '@nestjs/common';

// TODO: Create mock repository
class MockCommentRepository { }

describe('CommentService', () => {
    let service: CommentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                {
                    provide: ICommentRepository,
                    useClass: MockCommentRepository,
                },
                Logger,
            ],
        }).compile();

        service = module.get<CommentService>(CommentService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});