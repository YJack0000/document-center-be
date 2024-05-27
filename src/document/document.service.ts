import {
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IDocumentRepository } from './document.interface';
import { Document } from './document.entity';
import { CreateDocumentDto } from './dto/document.dto';
import { User } from 'src/strategy/jwt.strategy';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class DocumentService {
  constructor(
    @Inject(IDocumentRepository)
    private readonly documentRepository: IDocumentRepository,
    private readonly logger: Logger,
    private readonly helper: HelperService,
  ) {
    this.logger = new Logger(DocumentService.name);
  }

  async getMyDocuments(user: User) {
    this.logger.log(`Get My Documents`);
    return await this.documentRepository.findManyByCondition({
      where: { ownerId: user.id },
    });
  }

  async createDocument(user: User, body: CreateDocumentDto): Promise<Document> {
    this.logger.log(`Create Document`);
    const myDocument = {
      ...body,
      ownerId: user.id,
    };
    const document = this.documentRepository.create(myDocument);
    const result = await this.documentRepository.save(document);

    return result;
  }

  async getDocumentById(documentId: string): Promise<Document> {
    this.logger.log(`Get Document By Id`);
    return await this.documentRepository.findOneById(documentId);
  }

  async updateMyDocument(
    user: User,
    documentId: string,
    body: CreateDocumentDto,
  ): Promise<Document> {
    this.logger.log(`Update Document`);
    await this.helper.checkOwnership(user, documentId);
    const updatedDocument = {
      id: documentId,
      ...body,
    };

    return await this.documentRepository.upsert(updatedDocument);
  }

  async deleteMyDocument(user: User, documentId: string): Promise<void> {
    this.logger.log(`Delete Document`);
    await this.helper.checkOwnership(user, documentId);
    await this.documentRepository.removeById(documentId);
  }
}
