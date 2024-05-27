import { Logger, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from '../controllers/document.controller';
import { DocumentRepository } from 'src/repositories/document.repository';
import { IDocumentRepository } from './document.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { HelperModule } from 'src/helper/helper.module';
import { Review } from 'src/review/review.entity';
import { IReviewRepository } from 'src/review/review.interface';
import { ReviewRepository } from 'src/repositories/review.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Review]), HelperModule],
  providers: [
    DocumentService,
    {
      provide: IDocumentRepository,
      useClass: DocumentRepository,
    },
    {
      provide: IReviewRepository,
      useClass: ReviewRepository,
    },
    Logger,
  ],
  controllers: [DocumentController],
})
export class DocumentModule {}
