import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { IReviewRepository } from './review.interface';
import { Logger } from '@nestjs/common';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserReq } from 'src/strategy/jwt.strategy';
import { PaginationReqDto } from 'src/common/pagination.dto';
import { HelperService } from '../helper/helper.service';
import { IUserRepository } from 'src/users/user.interface';
import { MockReviewRepository } from '../mockRepositories/mockReviewRepo';
import { MockUserRepository } from 'src/mockRepositories/mockUserRepo';
import { Review } from './review.entity';
import { Document } from 'src/document/document.entity';
import { User } from 'src/users/user.entity';
describe('ReviewService', () => {
    let service: ReviewService;
    let mockReviewRepository: MockReviewRepository;
    let mockUserRepository: MockUserRepository;
    let mockHelperService: HelperService;

    beforeEach(async () => {
        jest.clearAllMocks();
        mockReviewRepository = new MockReviewRepository();
        mockUserRepository = new MockUserRepository();
        mockHelperService = {
            checkOwnership: jest.fn().mockResolvedValue(true),
            checkIsReviewerOrOwner: jest.fn().mockResolvedValue('reviewer'), // Default response setup
            changeDocumentStatus: jest.fn().mockResolvedValue(null),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewService,
                {
                    provide: IReviewRepository,
                    useValue: mockReviewRepository,
                },
                {
                    provide: IUserRepository,
                    useValue: mockUserRepository,
                },
                {
                    provide: HelperService,
                    useValue: mockHelperService,
                },
                Logger,
            ],
        }).compile();

        service = module.get<ReviewService>(ReviewService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('assignReviewer', () => {
        const user: UserReq = { id: 'user1', email: 'emily@gmail.com', name: 'Emily', isSuperUser: false };
        const documentId = 'doc1';
        const body = { reviewerId: 'user2' };
        const mockReview: Review = {
            id: '1',
            documentId: documentId,
            reviewerId: body.reviewerId,
            comment: '',
            status: 'wait',
            createdAt: new Date(),
            updatedAt: new Date(),
            reviewer: new User(),
            document: new Document()
        };

        it('Throw if trying to assign yourself as reviewer', async () => {
            await expect(service.assignReviewer({ ...user, id: 'user2' }, documentId, body))
                .rejects.toThrow(new ForbiddenException('You cannot assign yourself as a reviewer'));
        });

        it('Throw if reviewer not found', async () => {
            jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);
            await expect(service.assignReviewer(user, documentId, body))
                .rejects.toThrow(new NotFoundException('Reviewer not found'));
        });

        it('Successfully assign a reviewer', async () => {
            jest.spyOn(mockReviewRepository, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(mockReviewRepository, 'save').mockResolvedValueOnce(mockReview);
            const result = await service.assignReviewer(user, documentId, body);
            expect(result).toEqual(mockReview);
        });
        it('Throws error if ownership check fails', async () => {
            jest.spyOn(mockHelperService, 'checkOwnership').mockRejectedValue(new ForbiddenException());

            await expect(service.assignReviewer(user, documentId, body))
                .rejects.toThrow(ForbiddenException);
        });
        it('Throws error if there is already an existing review in "wait" status', async () => {
            jest.spyOn(mockReviewRepository, 'findOne').mockResolvedValueOnce(new Review());

            await expect(service.assignReviewer(user, documentId, body))
                .rejects.toThrow(new ForbiddenException('Reviewer already assigned'));
        });
        it('Throws error if there is already an existing review in "wait" status', async () => {
            jest.spyOn(mockReviewRepository, 'findOne').mockResolvedValueOnce(new Review());

            await expect(service.assignReviewer(user, documentId, body))
                .rejects.toThrow(new ForbiddenException('Reviewer already assigned'));
        });

        it('Throws error if owner tries to pass review', async () => {
            jest.spyOn(mockHelperService, 'checkIsReviewerOrOwner').mockResolvedValue('owner');

            await expect(service.passReview(user, documentId, { comment: 'Looks good' }))
                .rejects.toThrow(new ForbiddenException('Owner cannot pass the review'));
        });
    });

    describe('getMyReviews', () => {
        const user: UserReq = { id: 'user1', email: 'test@test.com', name: 'Test', isSuperUser: false };
        const query: PaginationReqDto = { page: 1, limit: 10 };

        it('Return paginated review results', async () => {
            jest.spyOn(mockReviewRepository, 'findAll').mockResolvedValueOnce([]);
            jest.spyOn(mockReviewRepository, 'count').mockResolvedValueOnce(0);
            const result = await service.getMyReviews(user, query);
            expect(result).toEqual({
                data: [],
                page: 1,
                limit: 10,
                totalPage: 0,
            });
        });

    });
});
