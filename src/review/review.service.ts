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
import { PaginationReqDto, PaginationResDto } from 'src/common/pagination.dto';

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
      relations: ['reviewer'],
      where: { documentId: documentId, reviewerId: user.id },
      select: {
        id: true,
        documentId: true,
        comment: true,
        status: true,
        reviewer: {
          id: true,
          name: true,
        },
      }
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

  async getMyDocumentReviews(
    user: UserReq,
    query: PaginationReqDto,
    documentId: string,
  ): Promise<PaginationResDto<Review>> {
    this.logger.log(`Get My Document Review`);
    await this.helper.checkOwnership(user, documentId);
    const { page, limit } = query;
    const totalAmount = await this.reviewRepository.count({
      where: { documentId: documentId },
    });
    const data = await this.reviewRepository.findAll({
      relations: ['reviewer'],
      where: { documentId: documentId },
      select: {
        id: true,
        comment: true,
        status: true,
        reviewer: {
          id: true,
          name: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      page: Number(page),
      limit: Number(limit),
      total: Math.ceil(totalAmount / limit),
    };
  }
}
