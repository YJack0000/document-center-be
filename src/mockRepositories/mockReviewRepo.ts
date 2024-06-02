import { Review } from 'src/review/review.entity';
import { DeepPartial } from 'typeorm';

export class MockReviewRepository {
    private reviews: Review[] = [];

    async upsert(data: DeepPartial<Review>): Promise<Review> {
        const index = this.reviews.findIndex(r => r.documentId === data.documentId && r.reviewerId === data.reviewerId);
        if (index !== -1) {
            Object.assign(this.reviews[index], data);
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

    async save(data: DeepPartial<Review>): Promise<Review> {
        const existingReview = this.reviews.find(r => r.documentId === data.documentId && r.reviewerId === data.reviewerId);
        if (existingReview) {
            Object.assign(existingReview, data);
            return existingReview;
        }
        const newReview = new Review();
        Object.assign(newReview, data);
        this.reviews.push(newReview);
        return newReview;
    }

    async count(options: any): Promise<number> {
        return this.reviews.filter(r => r.documentId === options.where.documentId).length;
    }

    async findAll(options: any): Promise<Review[]> {
        return this.reviews.filter(r => r.documentId === options.where.documentId).slice(options.skip, options.take + options.skip);
    }
    async findReviewsByDocumentId(documentId: string): Promise<Review[]> {
        return this.reviews.filter(review => review.documentId === documentId);
    }

}