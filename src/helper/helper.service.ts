import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IDocumentRepository } from 'src/document/document.interface';
import { PublicDocument } from 'src/public-document/public-document.entity';
import { IPublicDocumentRepository } from 'src/public-document/public-document.interface';
import { IReviewRepository } from 'src/review/review.interface';
import { UserReq } from 'src/strategy/jwt.strategy';
import { Not } from 'typeorm';

@Injectable()
export class HelperService {
  constructor(
    @Inject(IDocumentRepository)
    private readonly documentRepository: IDocumentRepository,
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    @Inject(IPublicDocumentRepository)
    private readonly publicDocumentRepository: IPublicDocumentRepository,
  ) {}

  async checkOwnership(user: UserReq, documentId: string) {
    // Check if the document exists and belongs to the user
    const document = await this.documentRepository.findOneById(documentId);
    if (!document) {
      // Document not found
      throw new NotFoundException('Document not found');
    }
    if (document.ownerId !== user.id && !user.isSuperUser) {
      // Document not found or does not belong to the user
      throw new ForbiddenException('Document does not belong to you');
    }
  }

  async checkIsReviewerOrOwner(
    user: UserReq,
    documentId: string,
  ): Promise<string> {
    // Check if the user is the reviewer or the owner of the document
    const reviews = await this.reviewRepository.findAll({
      where: {
        documentId: documentId,
        reviewerId: user.id,
        status: Not('delete'),
      },
    });
    if (reviews.length == 0) {
      // User is not the reviewer
      await this.checkOwnership(user, documentId);
      return 'owner';
    }
    // Check there is a review with status 'wait'
    const waitReview = reviews.find((review) => review.status === 'wait');
    if (!waitReview) {
      throw new ForbiddenException('You have already reviewed this document');
    }

    return 'reviewer';
  }

  async changeDocumentStatus(documentId: string, status: string) {
    // Update the document status
    await this.documentRepository.upsert({
      id: documentId,
      status: status,
    });
  }

  async publishDocument(documentId: string): Promise<PublicDocument> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId, status: 'pass' },
    });
    if (!document) {
      throw new NotFoundException('Document not found or not pass review');
    }
    const publicDocument = this.publicDocumentRepository.create(document);
    publicDocument.isPublic = true;
    return await this.publicDocumentRepository.upsert(publicDocument);
  }

  async unpublishDocument(documentId: string): Promise<PublicDocument> {
    const publicDocument =
      await this.publicDocumentRepository.findOneById(documentId);
    if (!publicDocument) {
      throw new NotFoundException('Public document not found');
    }
    // update isPublic to false
    publicDocument.isPublic = false;
    return await this.publicDocumentRepository.upsert(publicDocument);
  }
}
