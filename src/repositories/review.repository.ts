import { Injectable } from '@nestjs/common';
import { IReviewRepository } from 'src/review/review.interface';
import { BaseRepostitory } from '../common/base.repository';
import { Review } from 'src/review/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class ReviewRepository
    extends BaseRepostitory<Review>
    implements IReviewRepository {
    constructor(
        @InjectRepository(Review)
        reviewRepository: Repository<Review>,
    ) {
        super(reviewRepository);
    }
    public create(data: DeepPartial<Review>): Review {
        data.status = 'pass';
        if (!data.createAt) {
            data.createAt = new Date();
        }
        return super.create(data);
    }
}