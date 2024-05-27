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
    data.createAt = new Date();
    data.updateAt = new Date();

    return super.create(data);
  }

  public async upsert(data: DeepPartial<Document>): Promise<Document> {
    const existingEntity = await super.findOneById(data.id);
    if (existingEntity) {
      const updatedEntity = { ...existingEntity, ...data };
      existingEntity.updateAt = new Date();
      return await super.save(updatedEntity);
    } else {
      // Create new entity if it does not exist
      return await super.save(data);
    }
  }
}
