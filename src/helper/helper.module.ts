import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDocumentRepository } from 'src/document/document.interface';
import { DocumentRepository } from 'src/repositories/document.repository';
import { Document } from 'src/document/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  providers: [
    HelperService,
    {
      provide: IDocumentRepository,
      useClass: DocumentRepository,
    },
  ],
  exports: [HelperService],
})
export class HelperModule {}
