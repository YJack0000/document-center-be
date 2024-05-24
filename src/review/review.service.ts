import { Inject, Injectable, Logger } from '@nestjs/common';
import { IReviewRepository } from './review.interface';
import { Review } from './review.entity';
import { AssignReviewerDto, CreateReviewDto, UpdateReviewerDto } from './dto/review.dto';
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
    async assignReviewer(documentId: string, body: AssignReviewerDto): Promise<string> {
        const reviews = await this.reviewRepository.findAll({ where: { document_id: documentId } });
        const review = reviews[0];
        if (!review) {
            return 'Review not found';
        }
        review.document_id = documentId;
        review.reviewer_id = body.reviewer_id;
        await this.reviewRepository.save(review);
        return `Review assigned to document: ${documentId}`;
    }
    async updateReviewer(documentId: string, body: UpdateReviewerDto): Promise<string> {
        const reviews = await this.reviewRepository.findAll({ where: { document_id: documentId } });
        const review = reviews[0];
        if (!review) {
            return 'Review not found';
        }
        review.document_id = documentId;
        review.reviewer_id = body.reviewer_id;
        await this.reviewRepository.save(review);
        return `Review updated: ${documentId}`;
    }
}