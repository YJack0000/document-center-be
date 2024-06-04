import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IDocumentRepository } from './document.interface';
import { Document } from './document.entity';
import { CreateDocumentDto, UpdateStatusDto } from './dto/document.dto';
import { HelperService } from 'src/helper/helper.service';
import { IReviewRepository } from 'src/review/review.interface';
import { In, Not } from 'typeorm';
import { UserReq } from 'src/strategy/jwt.strategy';
import { PaginationReqDto, PaginationResDto } from 'src/common/pagination.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class DocumentService {
  constructor(
    @Inject(IDocumentRepository)
    private readonly documentRepository: IDocumentRepository,
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    @Inject('CACHE_MANAGER') private cache: Cache,
    private readonly logger: Logger,
    private readonly helper: HelperService,
  ) {
    this.logger = new Logger(DocumentService.name);
  }

  async getAllDocuments(
    query: PaginationReqDto,
  ): Promise<PaginationResDto<Document>> {
    this.logger.log(`Get All Documents`);
    const { page, limit } = query;
    const cachKey = `allDocuments-${page}-${limit}`;
    const cacheData = await this.cache.get<PaginationResDto<Document>>(cachKey);
    if (cacheData) {
      return cacheData;
    }
    const totalAmount = await this.documentRepository.count();
    const data = await this.documentRepository.findAll({
      relations: ['owner'],
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        createAt: true,
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

  async getMyDocuments(
    user: UserReq,
    query: PaginationReqDto,
  ): Promise<PaginationResDto<Document>> {
    this.logger.log(`Get My Documents`);
    const { page, limit } = query;
    const cachKey = `myDocuments-${user.id}-${page}-${limit}`;
    const cacheData = await this.cache.get<PaginationResDto<Document>>(cachKey);
    if (cacheData) {
      return cacheData;
    }
    const totalAmount = await this.documentRepository.count({
      where: { ownerId: user.id },
    });
    const data = await this.documentRepository.findAll({
      relations: ['owner'],
      where: { ownerId: user.id, status: Not('delete') },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        createAt: true,
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

  async createDocument(
    user: UserReq,
    body: CreateDocumentDto,
  ): Promise<Document> {
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
    const cachKey = `document-${documentId}`;
    const cacheData = await this.cache.get<Document>(cachKey);
    if (cacheData) {
      return cacheData;
    }
    const result =  await this.documentRepository.findOne({
      relations: ['owner'],
      where: { id: documentId, status: Not('delete') },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        createAt: true,
        updateAt: true,
        owner: {
          id: true,
          name: true,
        },
      },
    });
    await this.cache.set(cachKey, result);
    return result;
  }

  async updateMyDocument(
    user: UserReq,
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

  async deleteMyDocument(user: UserReq, documentId: string): Promise<void> {
    this.logger.log(`Delete Document`);
    await this.helper.checkOwnership(user, documentId);
    await this.documentRepository.updateOne(
      {
        where: { id: documentId },
      },
      {
        status: 'delete',
      },
    );
  }

  async getDocumentsAssignedToMe(
    user: UserReq,
    query: PaginationReqDto,
  ): Promise<PaginationResDto<Document>> {
    this.logger.log(`Get Documents Assigned To Me`);
    const { page, limit } = query;
    const cachKey = `assignedDocuments-${user.id}-${page}-${limit}`;
    const cacheData = await this.cache.get<PaginationResDto<Document>>(cachKey);
    if (cacheData) {
      return cacheData;
    }
    const myReviews = await this.reviewRepository.findAll({
      where: { reviewerId: user.id, status: 'wait'},
    });
    // Get document ids set from reviews
    const documentIds = myReviews.map((review) => review.documentId);
    // Get documents from document ids
    const totalAmount = await this.documentRepository.count({
      where: { id: In(documentIds) },
    });
    const data = await this.documentRepository.findAll({
      relations: ['owner'],
      where: { id: In(documentIds), status: Not('delete') },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        createAt: true,
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
}
