import { Module } from '@nestjs/common';
import { PublicDocumentService } from './public-document.service';
import { PublicDocumentController } from '../controllers/public-document.controller';

@Module({
  providers: [PublicDocumentService],
  controllers: [PublicDocumentController]
})
export class PublicDocumentModule {}
