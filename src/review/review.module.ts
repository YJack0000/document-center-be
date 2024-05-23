import { Logger, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from '../controllers/review.controller';
import { ReviewRepository } from 'src/repositories/review.repository';
import { IReviewRepository } from './review.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Review])],
    providers: [
        ReviewService,
        {
            provide: IReviewRepository,
            useClass: ReviewRepository,
        },
        Logger,
    ],
    controllers: [ReviewController],
})
export class ReviewModule { }