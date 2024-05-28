import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IReviewRepository } from './review.interface';
import { AssignReviewerDto, CreateReviewDto } from './dto/review.dto';
import { DeepPartial } from 'typeorm';
import { Review } from './review.entity';
import { HelperService } from 'src/helper/helper.service';
import { IUserRepository } from 'src/users/user.interface';
import { UserReq } from 'src/strategy/jwt.strategy';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(IUserRepository) private readonly authRepository: IUserRepository,
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    private readonly logger: Logger,
    private readonly helper: HelperService,
  ) {
    this.logger = new Logger(ReviewService.name);
  }

  async assignReviewer(
    user: UserReq,
    documentId: string,
    body: AssignReviewerDto,
  ) {
    this.logger.log(`Assign Reviewer`);
    await this.helper.checkOwnership(user, documentId);
    if (user.id === body.reviewerId) {
      throw new ForbiddenException('You cannot assign yourself as a reviewer');
    }
    // Get reviewer name
    const reviewer = await this.authRepository.findOne({
      where: { id: body.reviewerId },
    });
    if (!reviewer) {
      throw new NotFoundException('Reviewer not found');
    }
    let reviewData: DeepPartial<Review> = {
      ...body,
      documentId: documentId,
      reviewerId: body.reviewerId,
      reviewerName: reviewer.name,
    };
    return await this.reviewRepository.upsert(reviewData);
  }

  async addReviewToDocument(
    user: UserReq,
    documentId: string,
    body: CreateReviewDto,
  ) {
    this.logger.log(`Add Review`);
    // check you are the reviewer
    const review = await this.reviewRepository.findOne({
      where: { documentId: documentId, reviewerId: user.id },
    });
    if (!review) {
      throw new ForbiddenException('You are not the reviewer');
    }
    let reviewData: DeepPartial<Review> = {
      ...body,
      documentId: documentId,
    };
    return await this.reviewRepository.upsert(reviewData);
  }

  async getMyDocumentReviews(user: UserReq, documentId: string) {
    this.logger.log(`Get My Document Review`);
    await this.helper.checkOwnership(user, documentId);
    return await this.reviewRepository.findManyByCondition({
      where: { documentId: documentId },
    });
  }
}
