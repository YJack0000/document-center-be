import { Document } from 'src/document/document.entity';
import { IDocumentRepository } from 'src/document/document.interface';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Not,
  Repository,
} from 'typeorm';
interface NotCondition<T> {
  _type: 'Not';
  _value: T;
}
export class MockDocumentRepository implements IDocumentRepository {

  async findOne(options: FindOneOptions<Document>): Promise<Document> {
    const id = this.extractId(options.where);
    const foundDocument = this.documents.find(doc => doc.id === id);
    if (!foundDocument) {
      throw new Error('Document not found');
    }
    return foundDocument;
  }

  private extractId(whereCondition: any): string | undefined {
    if ('id' in whereCondition) {
      return whereCondition.id;
    }
    if (Array.isArray(whereCondition)) {
      return whereCondition.find(cond => 'id' in cond)?.id;
    }
    return whereCondition?.id;
  }

  async updateOne(filterCondition: FindOneOptions<Document>, updateData: DeepPartial<Document>): Promise<Document> {
    const documentId = this.extractId(filterCondition.where);
    const document = this.documents.find(doc => doc.id === documentId);
    if (document) {
      Object.assign(document, updateData);
      return document;
    }
    throw new Error('Document not found');
  }

  updateMany(
    filterCondition: FindManyOptions<Document>,
    updateData: DeepPartial<Document>,
  ): Promise<Document[]> {
    throw new Error('Method not implemented.');
  }
  documents: Document[] = [];

  async findOneById(id: string): Promise<Document | undefined> {
    return this.documents.find((doc) => doc.id === id);
  }

  create(data: DeepPartial<Document>): Document {
    const document = new Document();
    Object.assign(document, data);
    document.id = Math.random().toString(36).substring(7);
    this.documents.push(document);
    return document;
  }

  createMany(data: DeepPartial<Document>[]): Document[] {
    return data.map((d) => this.create(d));
  }

  async save(document: Document): Promise<Document> {
    const index = this.documents.findIndex((doc) => doc.id === document.id);
    if (index !== -1) {
      this.documents[index] = document;
    } else {
      document.id = Math.random().toString(36).substring(7);
      this.documents.push(document);
    }
    return document;
  }

  async saveMany(documents: DeepPartial<Document>[]): Promise<Document[]> {
    return Promise.all(documents.map((doc) => this.save(doc as Document)));
  }

  async removeById(id: string): Promise<Document> {
    const index = this.documents.findIndex((doc) => doc.id === id);
    if (index !== -1) {
      const [removedDocument] = this.documents.splice(index, 1);
      return removedDocument;
    } else {
      throw new Error('Document not found');
    }
  }



  async findOneByCondition(
    filterCondition: FindOneOptions<Document>,
  ): Promise<Document | undefined> {
    return this.findOne(filterCondition);
  }

  async findAll(options?: FindManyOptions<Document>): Promise<Document[]> {
    return this.documents.filter((doc) => {
      if (!options || !options.where) return true;
      let match = true;
      for (const key in options.where) {
        if (doc[key] !== options.where[key]) {
          match = false;
          break;
        }
      }
      return match;
    });
  }

  async count(options?: FindManyOptions<Document>): Promise<number> {
    return (await this.findAll(options)).length;
  }

  async findWithRelations(
    options?: FindManyOptions<Document>,
  ): Promise<Document[]> {
    return this.findAll(options);
  }

  async preload(entityLike: DeepPartial<Document>): Promise<Document> {
    const found = this.findOneById(entityLike.id as string);
    if (found) {
      return Object.assign(found, entityLike);
    }
    throw new Error('Document not found');
  }

  async upsert(data: DeepPartial<Document>): Promise<Document> {
    const existing = await this.findOneById(data.id as string);
    if (existing) {
      return this.save(Object.assign(existing, data));
    }
    return this.create(data);
  }

  async removeManyByCondition(
    filterCondition: FindManyOptions<Document>,
  ): Promise<Document[]> {
    const found = await this.findAll(filterCondition);
    found.forEach((doc) => {
      const index = this.documents.indexOf(doc);
      if (index > -1) {
        this.documents.splice(index, 1);
      }
    });
    return found;
  }
}
