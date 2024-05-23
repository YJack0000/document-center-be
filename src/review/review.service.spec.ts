import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { IReviewRepository } from './review.interface';
import { Logger } from '@nestjs/common';

// TODO: Create mock repository
class MockReviewRepository { }

describe('ReviewService', () => {
    let service: ReviewService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewService,
                {
                    provide: IReviewRepository,
                    useClass: MockReviewRepository,
                },
                Logger,
            ],
        }).compile();

        service = module.get<ReviewService>(ReviewService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});