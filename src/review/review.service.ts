import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IReviewRepository } from './review.interface';
import { AssignReviewerDto, CreateReviewDto } from './review.dto';
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
    if (user.isSuperUser) {
      this.logger.log(`Super User Assign Reviewer`);
      // update other review data, which status is wait, to transfer
      await this.reviewRepository.updateMany(
        {
          where: { documentId: documentId, status: 'wait' },
        },
        {
          status: 'transfer',
          updatedAt: new Date(),
        },
      );
    } else {
      this.logger.log(`Document Owner Assign Reviewer`);
      await this.helper.checkOwnership(user, documentId);
      if (user.id === body.reviewerId) {
        throw new ForbiddenException(
          'You cannot assign yourself as a reviewer',
        );
      }
    }
    // if there is already a review, throw an error
    const review = await this.reviewRepository.findOne({
      where: { documentId: documentId, status: 'wait' },
    });
    if (review) {
      throw new ForbiddenException('Reviewer already assigned');
    }
    await this.helper.changeDocumentStatus(documentId, 'review');
    return await this.reviewRepository.save(reviewData);
  }

  async passReview(user: UserReq, documentId: string, body: CreateReviewDto) {
    this.logger.log(`Pass Review`);
    const role = await this.helper.checkIsReviewerOrOwner(user, documentId);
    if (role === 'owner') {
      throw new ForbiddenException('Owner cannot pass the review');
    }
    await this.helper.changeDocumentStatus(documentId, 'pass');
    return await this.reviewRepository.updateOne(
      {
        where: { documentId: documentId, reviewerId: user.id, status: 'wait' },
      },
      {
        status: 'pass',
        comment: body.comment,
        updatedAt: new Date(),
      },
    );
  }

  async rejectReview(user: UserReq, documentId: string, body: CreateReviewDto) {
    this.logger.log(`Reject Review`);
    const role = await this.helper.checkIsReviewerOrOwner(user, documentId);
    if (role === 'owner') {
      throw new ForbiddenException('Owner cannot reject the review');
    }
    await this.helper.changeDocumentStatus(documentId, 'edit');
    return await this.reviewRepository.updateOne(
      {
        where: { documentId: documentId, reviewerId: user.id, status: 'wait' },
      },
      {
        status: 'reject',
        comment: body.comment,
        updatedAt: new Date(),
      },
    );
  }

  async getMyReviews(
    user: UserReq,
    query: PaginationReqDto,
  ): Promise<PaginationResDto<Review>> {
    this.logger.log(`Get My Review`);
    const { page, limit } = query;
    const totalAmount = await this.reviewRepository.count({
      where: { reviewerId: user.id },
    });
    const data = await this.reviewRepository.findAll({
      relations: ['document'],
      where: { reviewerId: user.id },
      select: {
        id: true,
        documentId: true,
        comment: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        document: {
          id: true,
          title: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(totalAmount / limit),
    };
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
        documentId: true,
        comment: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        reviewer: {
          id: true,
          name: true,
        },
      },
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(totalAmount / limit),
    };
  }
}
