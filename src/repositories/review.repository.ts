import { Injectable } from '@nestjs/common';
import { BaseRepostitory } from '../common/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
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

  public async save(data: DeepPartial<Review>): Promise<Review> {
    console.log('In save');
    if (!data.createdAt) data.createdAt = new Date();
    data.updatedAt = new Date();
    return await super.save(data);
  }

  public async upsert(data: DeepPartial<Review>): Promise<Review> {
    const review = await super.findOne({
      where: { documentId: data.documentId, reviewerId: data.reviewerId },
    });
    data.updatedAt = new Date();
    if (review) {
      return await super.save({ ...review, ...data });
    }
    data.createdAt = new Date();
    return await super.save(data);
  }
}
