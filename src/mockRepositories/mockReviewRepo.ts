import { Review } from 'src/review/review.entity';
import { DeepPartial } from 'typeorm';

export class MockReviewRepository {
    private reviews: Review[] = [];

    async upsert(data: DeepPartial<Review>): Promise<Review> {
        const index = this.reviews.findIndex(r => r.documentId === data.documentId && r.reviewerId === data.reviewerId);
        if (index !== -1) {
            this.reviews[index] = { ...this.reviews[index], ...data } as Review;
            return this.reviews[index];
        }
        const newReview = new Review();
        Object.assign(newReview, data);
        this.reviews.push(newReview);
        return newReview;
    }

    async findOne(options: any): Promise<Review | undefined> {
        return this.reviews.find(r => r.documentId === options.where.documentId && r.reviewerId === options.where.reviewerId);
    }

    async count(options: any): Promise<number> {
        return this.reviews.filter(r => r.documentId === options.where.documentId).length;
    }

    async findAll(options: any): Promise<Review[]> {
        return this.reviews.filter(r => r.documentId === options.where.documentId).slice(options.skip, options.take + options.skip);
    }
}
