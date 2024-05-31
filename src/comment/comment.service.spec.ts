import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { ICommentRepository } from './comment.interface';
import { Logger } from '@nestjs/common';
import { mockCommentRepository } from '../mockRepositories/mockCommentRepo';

describe('CommentService', () => {
    let service: CommentService;
    let commentRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                {
                    provide: ICommentRepository,
                    useFactory: mockCommentRepository
                },
                Logger,
            ],
        }).compile();

        service = module.get<CommentService>(CommentService);
        commentRepository = module.get<ICommentRepository>(ICommentRepository);
    });

    it('Be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllComments', () => {
        it('Return a paginated list of comments', async () => {
            const mockComments = [{ id: '1', content: 'Good Performance' }];
            commentRepository.count.mockResolvedValue(1);
            commentRepository.findAll.mockResolvedValue(mockComments);

            const result = await service.getAllComments({ documentId: '1', page: 1, limit: 10 });
            expect(result).toEqual({
                data: mockComments,
                page: 1,
                limit: 10,
                total: 1,
            });
            expect(commentRepository.count).toHaveBeenCalledWith({ where: { documentId: '1' } });
            expect(commentRepository.findAll).toHaveBeenCalledWith({
                where: { documentId: '1' },
                skip: 0,
                take: 10,
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
                relations: ["user"],
            });
        });
    });

    describe('createComment', () => {
        it('Create & return a comment', async () => {
            const userReq = { id: 'user1', name: 'Emily', email: 'emily@gmail.com', isSuperUser: false};
            const createCommentDto = { documentId: '1', content: 'Good Performance' };
            const expected = {
                documentId: '1',
                userId: userReq.id,
                content: 'Good Performance',
            };

            commentRepository.create.mockReturnValue(expected);
            commentRepository.save.mockResolvedValue(expected);

            const result = await service.createComment(userReq, createCommentDto);
            expect(result).toEqual(expected);
            expect(commentRepository.create).toHaveBeenCalledWith({
                documentId: '1',
                userId: userReq.id,
                content: 'Good Performance',
            });
            expect(commentRepository.save).toHaveBeenCalledWith(expected);
        });
    });
});
