import { Inject, Injectable, Logger } from '@nestjs/common';
import { IDocumentRepository } from './document.interface';
import { Document } from './document.entity';
import { CreateDocumentDto } from './dto/document.dto';

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

  async getDocumentById(documentId: string): Promise<Document | null> {
    this.logger.log(`Getting document by ID: ${documentId}`);
    const document = await this.documentRepository.findOneById(documentId);
    if (!document) {
      this.logger.warn(`Document not found: ID ${documentId}`);
      return null;
    }
    return document;
  }

  async createDocument(body: CreateDocumentDto): Promise<string> {
    this.logger.log(`Create Document`);
    const document = this.documentRepository.create(body);
    const result = await this.documentRepository.save(document);

    return `Document created: ${result.id}`;
  }

  async updateDocument(documentId: string, body: CreateDocumentDto): Promise<string> {
    this.logger.log(`Update Document`);
    const document = await this.documentRepository.findOneById(documentId);
    if (!document) {
      return 'Document not found';
    }

    const updatedDocument = this.documentRepository.create(body);
    updatedDocument.id = documentId;
    await this.documentRepository.save(updatedDocument);

    return `Document updated: ${documentId}`;
  }

  async deleteDocument(documentId: string): Promise<string> {
    this.logger.log(`Delete Document`);
    const document = await this.documentRepository.findOneById(documentId);
    if (!document) {
      return 'Document not found';
    }

    await this.documentRepository.remove(document);

    return `Document deleted: ${documentId}`;
  }
  async updateDocumentStatus(documentId: string, status: 'edit' | 'pass'): Promise<string> {
    this.logger.log(`Update Document Status for ID: ${documentId}`);

    const document = await this.documentRepository.findOneById(documentId);
    if (!document) {
      return 'Document not found';
    }

    document.status = status;
    await this.documentRepository.save(document);

    return `Document status updated to ${status} for Document ID: ${documentId}`;
  }

  async getDocumentsByOwner(ownerId: string): Promise<any> {
    this.logger.log(`Get documents assigned to owner: ${ownerId}`);
    const documents = await this.documentRepository.findByCondition({ where: { ownerId: ownerId } });
    if (!documents) {
      return `No documents found for owner: ${ownerId}`;
    }
    return documents;
  }

  /*async getPulicDocuments(): Promise<any> {
    this.logger.log(`Get public documents`);
    const documents = await this.documentRepository.findByCondition({ where: { public: true } });
    if (!documents) {
      return `No public documents found`;
    }
    return documents;
  }*/
}