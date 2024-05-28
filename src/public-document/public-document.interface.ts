import { BaseInterfaceRepository } from 'src/common/base.interface';
import { PublicDocument } from './public-document.entity';

export interface IPublicDocumentRepository
  extends BaseInterfaceRepository<PublicDocument> {}

export const IPublicDocumentRepository = Symbol('IPublicDocumentRepository');
