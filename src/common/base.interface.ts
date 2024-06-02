import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: string): Promise<T>;
  findOneByCondition(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  count(options?: FindManyOptions<T>): Promise<number>;
  updateMany(
    filterCondition: FindManyOptions<T>,
    updateData: DeepPartial<T>,
  ): Promise<T[]>;
  updateOne(
    filterCondition: FindOneOptions<T>,
    updateData: DeepPartial<T>,
  ): Promise<T>;
  removeById(id: string): Promise<T>;
  removeManyByCondition(filterCondition: FindManyOptions<T>): Promise<T[]>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
  findOne(options: FindOneOptions<T>): Promise<T>;
  upsert(data: DeepPartial<T>): Promise<T>;
}
