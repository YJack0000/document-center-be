import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReviewService } from '../review/review.service';
import { Review } from '../review/review.entity';
import { CreateReviewDto } from 'src/review/dto/review.dto';
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get(':documentId')
    async getReviewsbydocumentId(@Param('documentId') documentId: string): Promise<Review[]> {
        return await this.reviewService.getReviews();
    }
    @Post(':documentId')
    async createReview(@Param('documentId') documentId: string,
        @Body() body: CreateReviewDto): Promise<string> {
        return await this.reviewService.createReview(body);
    }
    @Put(':reviewId')
    async updateReview(
        @Param('reviewId') reviewId: string,
        @Body() body: CreateReviewDto,
    ): Promise<string> {
        return await this.reviewService.updateReview(reviewId, body);
    }

    @Delete(':reviewId')
    async deleteReview(@Param('reviewId') reviewId: string): Promise<string> {
        return await this.reviewService.deleteReview(reviewId);
    }
}