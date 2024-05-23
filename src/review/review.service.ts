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

    async getReviews(): Promise<Review[]> {
        this.logger.log(`Get Reviews`);
        return await this.reviewRepository.findAll();
    }
    async createReview(body: CreateReviewDto): Promise<string> {
        this.logger.log(`Create Review`);
        const review = this.reviewRepository.create(body);
        const result = await this.reviewRepository.save(review);

        return `Review created: ${result.id}`;
    }

    async updateReview(reviewId: string, body: CreateReviewDto): Promise<string> {
        this.logger.log(`Update Review`);
        const review = await this.reviewRepository.findOneById(reviewId);
        if (!review) {
            return 'Review not found';
        }

        const updatedReview = this.reviewRepository.create(body);
        updatedReview.id = reviewId;
        await this.reviewRepository.save(updatedReview);

        return `Review updated: ${reviewId}`;
    }

    async deleteReview(reviewId: string): Promise<string> {
        this.logger.log(`Delete Review`);
        const review = await this.reviewRepository.findOneById(reviewId);
        if (!review) {
            return 'Review not found';
        }

        await this.reviewRepository.remove(review);

        return `Review deleted: ${reviewId}`;
    }
}