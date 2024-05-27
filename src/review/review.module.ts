import { Logger, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from '../controllers/review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewRepository } from 'src/repositories/review.repository';
import { IReviewRepository } from './review.interface';
import { IAuthRepository } from 'src/auth/auth.interface';
import { AuthRepository } from 'src/repositories/auth.repository';
import { Auth } from 'src/auth/auth.entity';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Auth]), HelperModule],
  providers: [
    ReviewService,
    {
      provide: IReviewRepository,
      useClass: ReviewRepository,
    },
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
    Logger,
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
