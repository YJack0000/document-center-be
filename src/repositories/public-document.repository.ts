import { Injectable } from '@nestjs/common';
import { IPublicDocumentRepository } from 'src/public-document/public-document.interface';
import { BaseRepostitory } from '../common/base.repository';
import { PublicDocument } from 'src/public-document/public-document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class PublicDocumentRepository
  extends BaseRepostitory<PublicDocument>
  implements IPublicDocumentRepository {

  private repository: Repository<PublicDocument>;

  constructor(
    @InjectRepository(PublicDocument)
    publicdocumentRepository: Repository<PublicDocument>,
  ) {
    super(publicdocumentRepository);
    this.repository = publicdocumentRepository;
  }
  createQueryBuilder(alias: string): SelectQueryBuilder<PublicDocument> {
    return this.repository.createQueryBuilder(alias);
  }

  public findByCondition(filterCondition: FindOneOptions<PublicDocument>): Promise<PublicDocument> {
    filterCondition.where = { public: true };
    return super.findByCondition(filterCondition);
  }
}
