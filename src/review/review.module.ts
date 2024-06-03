import { Logger, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from '../controllers/review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewRepository } from 'src/repositories/review.repository';
import { IReviewRepository } from './review.interface';
import { HelperModule } from 'src/helper/helper.module';
import { IUserRepository } from 'src/users/user.interface';
import { UserRepository } from 'src/repositories/user.repository';
import { User } from 'src/users/user.entity';
import { MailerModule } from 'nestjs-mailer';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User]), HelperModule, MailerModule],
  providers: [
    ReviewService,
    {
      provide: IReviewRepository,
      useClass: ReviewRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    Logger,
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
