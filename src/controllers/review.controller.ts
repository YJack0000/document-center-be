import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PaginationReqDto } from 'src/common/pagination.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserGuard } from 'src/guard/user.guard';
import { AssignReviewerDto, CreateReviewDto } from 'src/review/dto/review.dto';
import { ReviewService } from 'src/review/review.service';
import { PaginationResDto } from '../common/pagination.dto';
import { Review } from 'src/review/review.entity';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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

  @Post('/:documentId')
  @UseGuards(JwtAuthGuard, UserGuard)
  async addReviewToDocument(
    @Req() req,
    @Param('documentId') documentId: string,
    @Body() body: CreateReviewDto,
    @Res() res,
  ) {
    const result = await this.reviewService.addReviewToDocument(
      req.user,
      documentId,
      body,
    );
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
