import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserGuard } from 'src/guard/user.guard';
import { AssignReviewerDto, CreateReviewDto } from 'src/review/dto/review.dto';
import { ReviewService } from 'src/review/review.service';

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
    @Res() res,
  ) {
    const result = await this.reviewService.getMyDocumentReviews(
      req.user,
      documentId,
    );
    return res.status(HttpStatus.OK).json(result);
  }
}
