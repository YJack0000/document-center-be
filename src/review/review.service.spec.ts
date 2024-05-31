import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { MockReviewRepository } from '../mockRepositories/mockReviewRepo';
import { IReviewRepository } from './review.interface';
import { Logger } from '@nestjs/common';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserReq } from 'src/strategy/jwt.strategy';
import { PaginationReqDto } from 'src/common/pagination.dto';
import { HelperService } from '../helper/helper.service';
import { IUserRepository } from 'src/users/user.interface';
import { MockUserRepository } from 'src/mockRepositories/mockUserRepo';


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


        it('Throw if trying to assign yourself as reviewer', async () => {
            await expect(service.assignReviewer({ ...user, id: 'user2' }, documentId, body))
                .rejects.toThrow(new ForbiddenException('You cannot assign yourself as a reviewer'));
        });


        it('Throw if reviewer not found', async () => {
            jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(undefined);
            await expect(service.assignReviewer(user, documentId, body))
                .rejects.toThrow(new NotFoundException('Reviewer not found'));
        });


        it('Successfully assign a reviewer', async () => {
            jest.spyOn(mockReviewRepository, 'findOne').mockResolvedValueOnce(undefined);
            const result = await service.assignReviewer(user, documentId, body);
            expect(result).toBeDefined();
        });
    });


    describe('getMyDocumentReviews', () => {
        const user: UserReq = { id: 'user3', email: 'mina@gmail.com', name: 'Mina', isSuperUser: false };
        const documentId = 'doc1';
        const query: PaginationReqDto = { page: 1, limit: 10 };


        it('Return paginated review results', async () => {
            jest.spyOn(mockReviewRepository, 'findAll').mockResolvedValueOnce([]);
            jest.spyOn(mockReviewRepository, 'count').mockResolvedValueOnce(0);


            const result = await service.getMyDocumentReviews(user, query, documentId);
            expect(result).toEqual({
                data: [],
                page: 1,
                limit: 10,
                totalPage: 0,
            });
        });
    });
});