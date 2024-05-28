import { Logger, Module } from '@nestjs/common';
import { PublicDocumentService } from './public-document.service';
import { PublicDocumentController } from '../controllers/public-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/document/document.entity';
import { PublicDocument } from './public-document.entity';
import { IPublicDocumentRepository } from './public-document.interface';
import { PublicDocumentRepository } from 'src/repositories/public-document.repository';
import { IDocumentRepository } from 'src/document/document.interface';
import { DocumentRepository } from 'src/repositories/document.repository';
import { HelperModule } from 'src/helper/helper.module';
import { HelperService } from 'src/helper/helper.service';

@Module({
  imports: [TypeOrmModule.forFeature([PublicDocument, Document]), HelperModule],
  providers: [
    PublicDocumentService,
    {
      provide: IPublicDocumentRepository,
      useClass: PublicDocumentRepository,
    },
    {
      provide: IDocumentRepository,
      useClass: DocumentRepository,
    },
    Logger,
  ],
  controllers: [PublicDocumentController],
})
export class PublicDocumentModule {}
