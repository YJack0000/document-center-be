import { Inject, Injectable, Logger } from '@nestjs/common';
import { IDocumentRepository } from './document.interface';
import { Document } from './document.entity';
import { CreateDocumentDto } from './dto/document.dto';
import { User } from 'src/strategy/jwt.strategy';

@Injectable()
export class DocumentService {
  constructor(
    @Inject(IDocumentRepository)
    private readonly documentRepository: IDocumentRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(DocumentService.name);
  }

  async getMyDocuments(user: User): Promise<Document[]> {
    this.logger.log(`Get My Documents`);
    return await this.documentRepository.findManyByCondition({
      where: { ownerId: user.id },
    });
  }

  async createDocument(
    user: User,
    body: CreateDocumentDto,
  ): Promise<string> {
    this.logger.log(`Create Document`);
    const myDocument = {
      ...body,
      ownerId: user.id,
    };
    const document = this.documentRepository.create(myDocument);
    const result = await this.documentRepository.save(document);

    return `Document created: ${result.id}`;
  }

  async getDocumentById(documentId: string): Promise<Document> {
    this.logger.log(`Get Document By Id`);
    return await this.documentRepository.findOneById(documentId);
  }

  async updateMyDocument(
    user: User,
    documentId: string,
    body: CreateDocumentDto,
  ): Promise<string> {
    this.logger.log(`Update Document`);
    // Check if the document exists and belongs to the user
    const document = await this.documentRepository.findOneById(documentId);
    if (!document || document.ownerId !== user.id) {
      return 'Document not found or does not belong to you';
    }

    const updatedDocument = {
      id: documentId,
      ...body,
    };

    await this.documentRepository.upsert(updatedDocument);

    return `Document updated: ${documentId}`;
  }

  async deleteDocument(documentId: string): Promise<string> {
    this.logger.log(`Delete Document`);
    await this.documentRepository.removeById(documentId);

    return `Document deleted: ${documentId}`;
  }
}
