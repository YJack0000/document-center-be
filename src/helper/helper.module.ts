import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDocumentRepository } from 'src/document/document.interface';
import { DocumentRepository } from 'src/repositories/document.repository';
import { Document } from 'src/document/document.entity';
import { IReviewRepository } from 'src/review/review.interface';
import { ReviewRepository } from 'src/repositories/review.repository';
import { Review } from 'src/review/review.entity';
import { PublicDocument } from 'src/public-document/public-document.entity';
import { IPublicDocumentRepository } from 'src/public-document/public-document.interface';
import { PublicDocumentRepository } from 'src/repositories/public-document.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Review, PublicDocument])],
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
    {
      provide: IPublicDocumentRepository,
      useClass: PublicDocumentRepository,
    }
  ],
  exports: [HelperService],
})
export class HelperModule {}
