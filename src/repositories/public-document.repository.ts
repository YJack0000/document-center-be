import { Injectable } from '@nestjs/common';
import { IPublicDocumentRepository } from 'src/public-document/public-document.interface';
import { BaseRepostitory } from '../common/base.repository';
import { PublicDocument } from 'src/public-document/public-document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class PublicDocumentRepository
  extends BaseRepostitory<PublicDocument>
  implements IPublicDocumentRepository {
  constructor(
    @InjectRepository(PublicDocument)
    publicdocumentRepository: Repository<PublicDocument>,
  ) {
    super(publicdocumentRepository);
  }

  public create(data: DeepPartial<PublicDocument>): PublicDocument {
    data.public = true;
    //data.updateAt = new Date();

    return super.create(data);
  }
}