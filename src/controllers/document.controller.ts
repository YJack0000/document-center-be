import { Controller, Get } from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { Document } from '../document/document.entity';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  async getDocuments(): Promise<Document[]> {
    return await this.documentService.getDocuments();
  }
}
