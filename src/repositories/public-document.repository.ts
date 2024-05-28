import { Injectable } from '@nestjs/common';
import { BaseRepostitory } from '../common/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { PublicDocument } from 'src/public-document/public-document.entity';
import { IPublicDocumentRepository } from 'src/public-document/public-document.interface';

@Injectable()
export class PublicDocumentRepository
  extends BaseRepostitory<PublicDocument>
  implements IPublicDocumentRepository
{
  constructor(
    @InjectRepository(PublicDocument)
    publicDocumentRepository: Repository<PublicDocument>,
  ) {
    super(publicDocumentRepository);
  }

}
