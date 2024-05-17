import { Injectable } from '@nestjs/common';
import { IDocumentRepository } from 'src/document/document.interface';
import { BaseRepostitory } from '../common/base.repository';
import { Document } from 'src/document/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
