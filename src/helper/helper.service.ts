import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { IDocumentRepository } from 'src/document/document.interface';
import { User } from 'src/strategy/jwt.strategy';

@Injectable()
export class HelperService {
  constructor(
    @Inject(IDocumentRepository)
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async checkOwnership(user: User, documentId: string) {
    // Check if the document exists and belongs to the user
    const document = await this.documentRepository.findOneById(documentId);
    if (!document || document.ownerId !== user.id) {
      // Document not found or does not belong to the user
      throw new ForbiddenException(
        'Document not found or does not belong to you',
      );
    }
  }
}
