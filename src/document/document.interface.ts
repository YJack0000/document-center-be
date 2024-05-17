import { BaseInterfaceRepository } from 'src/common/base.interface';
import { Document } from './document.entity';

export interface IDocumentRepository
  extends BaseInterfaceRepository<Document> {}

export const IDocumentRepository = Symbol('IDocumentRepository');
