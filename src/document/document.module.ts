import { Logger, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from '../controllers/document.controller';
import { DocumentRepository } from 'src/repositories/document.repository';
import { IDocumentRepository } from './document.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
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
