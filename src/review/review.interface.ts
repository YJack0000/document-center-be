import { BaseInterfaceRepository } from 'src/common/base.interface';
import { Review } from './review.entity';

export interface IReviewRepository
    extends BaseInterfaceRepository<Review> { }

export const IReviewRepository = Symbol('IReviewRepository');