import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseInterfaceRepository } from './base.interface';

interface HasId {
  id: string;
}

export class BaseRepostitory<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.entity.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return await this.entity.findOneBy(options);
  }

  public async findOneByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  public async findManyByCondition(filterCondition: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async removeById(id: string): Promise<T> {
    const entity = await this.findOneById(id);
    return await this.entity.remove(entity);
  }

  public async removeManyByCondition(filterCondition: FindOneOptions<T>): Promise<T[]> {
    const entity = await this.findManyByCondition(filterCondition);
    return await this.entity.remove(entity);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }

  public async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.entity.findOne(options);
  }

  public async upsert(data: DeepPartial<T>): Promise<T> {
    const existingEntity = await this.entity.findOneBy({ id: data.id as any });
    if (existingEntity) {
      // Merge the new data with existing entity
      const updatedEntity = { ...existingEntity, ...data };
      return await this.entity.save(updatedEntity);
    } else {
      // Create new entity if it does not exist
      return await this.entity.save(data);
    }
  }
}
