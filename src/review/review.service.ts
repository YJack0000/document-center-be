import { Inject, Injectable, Logger } from '@nestjs/common';
import { IReviewRepository } from './review.interface';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/review.dto';
@Injectable()
export class ReviewService {
    constructor(
        @Inject(IReviewRepository)
        private readonly reviewRepository: IReviewRepository,
        private readonly logger: Logger,
    ) {
        this.logger = new Logger(ReviewService.name);
    }

    async getReviews(documentId: string): Promise<Review[]> {
        return await this.reviewRepository.findAll({ where: { document_id: documentId } });
    }

    async createReview(documentId: string, createReviewDto: CreateReviewDto): Promise<Review> {
        const review = this.reviewRepository.create({
            ...createReviewDto,
            document_id: documentId
        });
        return await this.reviewRepository.save(review);
    }
}