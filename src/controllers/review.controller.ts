import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PaginationReqDto } from 'src/common/pagination.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserGuard } from 'src/guard/user.guard';
import { AssignReviewerDto, CreateReviewDto } from 'src/review/review.dto';
import { ReviewService } from 'src/review/review.service';
import { PaginationResDto } from '../common/pagination.dto';
import { Review } from 'src/review/review.entity';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard, UserGuard)
  async getMyReviews(
    @Req() req,
    @Query(new ValidationPipe({ transform: true })) query: PaginationReqDto,
    @Res() res,
  ): Promise<PaginationResDto<Review>> {
    const result = await this.reviewService.getMyReviews(req.user, query);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/:documentId/assign')
  @UseGuards(JwtAuthGuard, UserGuard)
  async assignReviewer(
    @Req() req,
    @Param('documentId') documentId: string,
    @Body() body: AssignReviewerDto,
    @Res() res,
  ) {
    const result = await this.reviewService.assignReviewer(
      req.user,
      documentId,
      body,
    );
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put('/:documentId/pass')
  @UseGuards(JwtAuthGuard, UserGuard)
  async passReview(
    @Req() req,
    @Param('documentId') documentId: string,
    @Body() body: CreateReviewDto,
    @Res() res,
  ) {
    const result = await this.reviewService.passReview(
      req.user,
      documentId,
      body,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('/:documentId/reject')
  @UseGuards(JwtAuthGuard, UserGuard)
  async rejectReview(
    @Req() req,
    @Param('documentId') documentId: string,
    @Body() body: CreateReviewDto,
    @Res() res,
  ) {
    const result = await this.reviewService.rejectReview(req.user, documentId, body);
    return res.status(HttpStatus.OK).json(result);
  }


  @Get('/:documentId')
  @UseGuards(JwtAuthGuard, UserGuard)
  async getReviewByDocumentId(
    @Req() req,
    @Param('documentId') documentId: string,
    @Query(new ValidationPipe({ transform: true })) query: PaginationReqDto,
    @Res() res,
  ): Promise<PaginationResDto<Review>> {
    const result = await this.reviewService.getMyDocumentReviews(
      req.user,
      query,
      documentId,
    );
    return res.status(HttpStatus.OK).json(result);
  }
}
