import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDocumentRepository } from 'src/document/document.interface';
import { DocumentRepository } from 'src/repositories/document.repository';
import { Document } from 'src/document/document.entity';
import { IReviewRepository } from 'src/review/review.interface';
import { ReviewRepository } from 'src/repositories/review.repository';
import { Review } from 'src/review/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Review])],
  providers: [
    HelperService,
    {
      provide: IDocumentRepository,
      useClass: DocumentRepository,
    },
    {
      provide: IReviewRepository,
      useClass: ReviewRepository,
    },
  ],
  exports: [HelperService],
})
export class HelperModule {}
