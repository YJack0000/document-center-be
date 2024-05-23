import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReviewService } from '../review/review.service';
import { Review } from '../review/review.entity';
import { AssignReviewerDto, CreateReviewDto, UpdateReviewerDto } from 'src/review/dto/review.dto';
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get(':documentId')
    async getReviewsbydocumentId(@Param('documentId') documentId: string): Promise<Review[]> {
        return await this.reviewService.getReviews(documentId);
    }
    @Post(':documentId')
    async createReview(@Param('documentId') documentId: string,
        @Body() body: CreateReviewDto): Promise<Review> {
        return await this.reviewService.createReview(documentId, body);
    }
    @Post(':documentId/assign')
    async assignReviewer(@Param('documentId') documentId: string,
        @Body() body: AssignReviewerDto): Promise<string> {
        return await this.reviewService.assignReviewer(documentId, body);
    }
    @Put(':documentId/assign')
    async updateReviewer(@Param('documentId') documentId: string,
        @Body() body: UpdateReviewerDto): Promise<string> {
        return await this.reviewService.updateReviewer(documentId, body);
    }
}