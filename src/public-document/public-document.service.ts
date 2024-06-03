import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPublicDocumentRepository } from './public-document.interface';
import { IDocumentRepository } from 'src/document/document.interface';
import { HelperService } from 'src/helper/helper.service';
import { PublicDocument } from './public-document.entity';
import { UpdatePublicDocumentStatusDto } from './dto/public-document.dto';
import { UserReq } from 'src/strategy/jwt.strategy';
import { PaginationReqDto, PaginationResDto } from 'src/common/pagination.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class PublicDocumentService {
  constructor(
    @Inject(IPublicDocumentRepository)
    private readonly publicDocumentRepository: IPublicDocumentRepository,
    @Inject(IDocumentRepository)
    private readonly documentRepository: IDocumentRepository,
    @Inject('CACHE_MANAGER') private cache: Cache,
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

  async getAllPublicDocuments(
    query: PaginationReqDto,
  ): Promise<PaginationResDto<PublicDocument>> {
    const { page, limit } = query;
    const cachKey = `allPublicDocuments-${page}-${limit}`;
    const cacheData =
      await this.cache.get<PaginationResDto<PublicDocument>>(cachKey);
    if (cacheData) {
      return cacheData;
    }
    const totalAmount = await this.publicDocumentRepository.count();
    const data = await this.publicDocumentRepository.findAll({
      relations: ['owner'],
      select: {
        id: true,
        title: true,
        content: true,
        updateAt: true,
        owner: {
          id: true,
          name: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const result = {
      data,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(totalAmount / limit),
    };
    await this.cache.set(cachKey, result);
    return result;
  }

  async getPublicDocumentsByUserId(
    userId: string,
    query: PaginationReqDto,
  ): Promise<PaginationResDto<PublicDocument>> {
    const { page, limit } = query;
    const cachKey = `publicDocuments-${userId}-${page}-${limit}`;
    const cacheData =
      await this.cache.get<PaginationResDto<PublicDocument>>(cachKey);
    if (cacheData) {
      return cacheData;
    }
    const totalAmount = await this.publicDocumentRepository.count({
      where: { ownerId: userId },
    });
    const data = await this.publicDocumentRepository.findAll({
      relations: ['owner'],
      where: { ownerId: userId },
      select: {
        id: true,
        title: true,
        content: true,
        updateAt: true,
        owner: {
          id: true,
          name: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const result = {
      data,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(totalAmount / limit),
    };
    await this.cache.set(cachKey, result);
    return result;
  }

  private async publishDocument(documentId: string): Promise<PublicDocument> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId, status: 'pass' },
    });
    if (!document) {
      throw new NotFoundException('Document not found or not pass review');
    }
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
