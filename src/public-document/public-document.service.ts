import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPublicDocumentRepository } from './public-document.interface';
import { IDocumentRepository } from 'src/document/document.interface';
import { HelperService } from 'src/helper/helper.service';
import { PublicDocument } from './public-document.entity';
import { UpdatePublicDocumentStatusDto } from './dto/public-document.dto';
import { UserReq } from 'src/strategy/jwt.strategy';

@Injectable()
export class PublicDocumentService {
  constructor(
    @Inject(IPublicDocumentRepository)
    private readonly publicDocumentRepository: IPublicDocumentRepository,
    @Inject(IDocumentRepository)
    private readonly documentRepository: IDocumentRepository,
    private readonly logger: Logger,
    private readonly helper: HelperService,
  ) {
    this.logger = new Logger(PublicDocumentService.name);
  }

  async updatePublicDocumentStatus(
    user: UserReq,
    documentId: string,
    body: UpdatePublicDocumentStatusDto,
  ): Promise<PublicDocument> {
    await this.helper.checkOwnership(user, documentId);
    const { isPublic } = body;
    if (!isPublic) {
      return await this.unpublishDocument(documentId);
    }
    return await this.publishDocument(documentId);
  }

  async getAllPublicDocuments(): Promise<PublicDocument[]> {
    return await this.publicDocumentRepository.findAll();
  }

  async getPublicDocumentsByUserId(userId: string): Promise<PublicDocument[]> {
    return await this.publicDocumentRepository.findManyByCondition({
      where: { ownerId: userId },
    });
  }

  private async publishDocument(documentId: string): Promise<PublicDocument> {
    const document = await this.documentRepository.findOneById(documentId);
    const publicDocument = this.publicDocumentRepository.create(document);
    return await this.publicDocumentRepository.save(publicDocument);
  }

  private async unpublishDocument(documentId: string): Promise<PublicDocument> {
    const publicDocument =
      await this.publicDocumentRepository.findOneById(documentId);
    if (!publicDocument) {
      throw new NotFoundException('Public document not found');
    }
    return await this.publicDocumentRepository.removeById(documentId);
  }
}
