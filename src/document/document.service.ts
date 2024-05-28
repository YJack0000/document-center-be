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
import { In } from 'typeorm';
import { UserReq } from 'src/strategy/jwt.strategy';
import { PaginationReqDto, PaginationResDto } from 'src/common/pagination.dto';

@Injectable()
export class DocumentService {
  constructor(
    @Inject(IDocumentRepository)
    private readonly documentRepository: IDocumentRepository,
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    private readonly logger: Logger,
    private readonly helper: HelperService,
  ) {
    this.logger = new Logger(DocumentService.name);
  }

  async getMyDocuments(
    user: UserReq,
  ){
    this.logger.log(`Get My Documents`);
    const data = await this.documentRepository.findManyByCondition({
      where: { ownerId: user.id },
    });
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
    return await this.documentRepository.findOneById(documentId);
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
    await this.documentRepository.removeById(documentId);
  }

  async changeDocumentStatus(
    user: UserReq,
    documentId: string,
    body: UpdateStatusDto,
  ): Promise<Document> {
    this.logger.log(`Change Document Status`);
    const { status } = body;
    const role = await this.helper.checkIsReviewerOrOwner(user, documentId);
    let statusList = [];
    if (role === 'owner') {
      statusList = ['edit', 'review'];
      if (!statusList.includes(status)) {
        throw new BadRequestException(
          'Owner can only change status to edit or review',
        );
      }
    } else if (role === 'reviewer') {
      statusList = ['pass', 'reject'];
      if (!statusList.includes(status)) {
        throw new BadRequestException(
          'Reviewer can only change status to pass or reject',
        );
      }
    } else {
      throw new ForbiddenException('You are not the owner or reviewer');
    }
    const document = await this.documentRepository.findOneById(documentId);
    document.status = status;
    return await this.documentRepository.upsert(document);
  }

  async getDocumentsAssignedToMe(user: UserReq) {
    this.logger.log(`Get Documents Assigned To Me`);
    const myReviews = await this.reviewRepository.findManyByCondition({
      where: { reviewerId: user.id },
    });
    // Get document ids set from reviews
    const documentIds = myReviews.map((review) => review.documentId);
    // Get documents from document ids
    return await this.documentRepository.findManyByCondition({
      where: { id: In(documentIds) },
    });
  }
}
