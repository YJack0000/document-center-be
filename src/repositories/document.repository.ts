import { Injectable } from '@nestjs/common';
import { IDocumentRepository } from 'src/document/document.interface';
import { BaseRepostitory } from '../common/base.repository';
import { Document } from 'src/document/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class DocumentRepository
  extends BaseRepostitory<Document>
  implements IDocumentRepository
{
  constructor(
    @InjectRepository(Document)
    documentRepository: Repository<Document>,
  ) {
    super(documentRepository);
  }

  public create(data: DeepPartial<Document>): Document {
    data.status = 'edit';
    if (!data.createAt){
      data.createAt = new Date();
    }
    data.updateAt = new Date();

    return super.create(data);
  }
}
