import { Inject, Injectable, Logger } from '@nestjs/common';
import { IDocumentRepository } from './document.interface';
import { Document } from './document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @Inject(IDocumentRepository)
    private readonly documentRepository: IDocumentRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(DocumentService.name);
  }

  async getDocuments(): Promise<Document[]> {
    this.logger.log(`Get Documents`);
    return await this.documentRepository.findAll();
  }
}
