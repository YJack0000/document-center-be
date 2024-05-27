import { Injectable } from '@nestjs/common';
import { BaseRepostitory } from '../common/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Review } from 'src/review/review.entity';
import { IReviewRepository } from 'src/review/review.interface';

@Injectable()
export class ReviewRepository
  extends BaseRepostitory<Review>
  implements IReviewRepository
{
  constructor(
    @InjectRepository(Review)
    reviewRepository: Repository<Review>,
  ) {
    super(reviewRepository);
  }

  public async upsert(data: DeepPartial<Review>): Promise<Review> {
    const review = await super.findOne({
      where: { documentId: data.documentId, reviewerId: data.reviewerId },
    });
    if (review) {
      console.log('review', review);
      console.log('data', data);
      console.log('review + data', { ...review, ...data });
      return await super.save({ ...review, ...data });
    }
    return await super.save(data);
  }
}
