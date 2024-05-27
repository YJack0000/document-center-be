import { Logger, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from '../controllers/document.controller';
import { DocumentRepository } from 'src/repositories/document.repository';
import { IDocumentRepository } from './document.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), HelperModule],
  providers: [
    DocumentService,
    {
      provide: IDocumentRepository,
      useClass: DocumentRepository,
    },
    Logger,
  ],
  controllers: [DocumentController],
})
export class DocumentModule {}
