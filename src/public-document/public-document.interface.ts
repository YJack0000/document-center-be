import { BaseInterfaceRepository } from 'src/common/base.interface';
import { PublicDocument } from './public-document.entity';
import { SelectQueryBuilder } from 'typeorm';
export interface IPublicDocumentRepository
    extends BaseInterfaceRepository<PublicDocument> { }

export const IPublicDocumentRepository = Symbol('IPublicDocumentRepository');

export interface IPublicDocumentRepository extends BaseInterfaceRepository<PublicDocument> {
    createQueryBuilder(alias: string): SelectQueryBuilder<PublicDocument>;
}