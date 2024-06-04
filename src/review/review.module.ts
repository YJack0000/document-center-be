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
import { PublicDocument } from 'src/public-document/public-document.entity';
import { IPublicDocumentRepository } from 'src/public-document/public-document.interface';
import { PublicDocumentRepository } from 'src/repositories/public-document.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, User, PublicDocument]),
    HelperModule,
    MailerModule,
  ],
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
    {
      provide: IPublicDocumentRepository,
      useClass: PublicDocumentRepository,
    },
    Logger,
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
