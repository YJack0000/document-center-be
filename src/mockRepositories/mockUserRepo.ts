import { User } from 'src/users/user.entity';
import { IUserRepository } from 'src/users/user.interface';
import { DeepPartial, FindOneOptions, FindManyOptions } from 'typeorm';

export class MockUserRepository implements IUserRepository {
    private users: Map<string, User> = new Map<string, User>();

    constructor() {
        for (let i = 1; i <= 10; i++) {
            this.users.set(`user${i}`, {
                id: `user${i}`,
                name: `User ${i}`,
                email: `user${i}@gmail.com`,
                isSuperUser: i % 2 === 0
            } as any);
        }
    }

    async findOneById(id: string): Promise<User> {
        return this.users.get(id);
    }

    async findAll(options?: FindManyOptions<User>): Promise<User[]> {
        const { skip, take } = options;
        const allUsers = Array.from(this.users.values());
        return allUsers.slice(skip, skip + take);
    }

    async count(options?: FindManyOptions<User>): Promise<number> {
        return this.users.size;
    }

    async findOne(options: FindOneOptions<User>): Promise<User | undefined> {
        const userId = options.where ? (options.where as any).id : null;
        return this.users.get(userId);
    }

    create(data: DeepPartial<User>): User {
        return { ...data } as User;
    }

    save(data: DeepPartial<User>): Promise<User> {
        return Promise.resolve({ ...data } as User);
    }

    updateOne(filterCondition: FindOneOptions<User>, updateData: DeepPartial<User>): Promise<User> {
        return Promise.reject('not implemented');
    }

    updateMany(filterCondition: FindManyOptions<User>, updateData: DeepPartial<User>): Promise<User[]> {
        const allUsers = Array.from(this.users.values()).filter(user =>
            Object.entries(filterCondition.where).every(([key, value]) => user[key] === value)
        );
        const updatedUsers = allUsers.map(user => ({ ...user, ...updateData } as User));
        return Promise.resolve(updatedUsers);
    }

    removeById(id: string): Promise<User> {
        const user = this.users.get(id);
        this.users.delete(id);
        return Promise.resolve(user);
    }

    removeManyByCondition(filterCondition: FindManyOptions<User>): Promise<User[]> {
        const usersToRemove = Array.from(this.users.values()).filter(user =>
            Object.entries(filterCondition.where).every(([key, value]) => user[key] === value)
        );
        usersToRemove.forEach(user => this.users.delete(user.id));
        return Promise.resolve(usersToRemove);
    }

    createMany(data: DeepPartial<User>[]): User[] {
        return data.map(d => ({ ...d } as User));
    }

    saveMany(data: DeepPartial<User>[]): Promise<User[]> {
        return Promise.resolve(data.map(d => ({ ...d } as User)));
    }

    findOneByCondition(filterCondition: FindOneOptions<User>): Promise<User> {
        const conditions = filterCondition.where as any;
        const foundUser = Array.from(this.users.values()).find(user =>
            Object.entries(conditions).every(([key, value]) => user[key] === value)
        );
        return Promise.resolve(foundUser);
    }

    findWithRelations(relations: FindManyOptions<User>): Promise<User[]> {
        return this.findAll(relations);
    }

    preload(entityLike: DeepPartial<User>): Promise<User> {
        return Promise.resolve(entityLike as User);
    }

    upsert(data: DeepPartial<User>): Promise<User> {
        const existingUser = this.users.get(data.id as string);
        if (existingUser) {
            const updatedUser = { ...existingUser, ...data } as User;
            this.users.set(updatedUser.id, updatedUser);
            return Promise.resolve(updatedUser);
        } else {
            const newUser = { ...data } as User;
            this.users.set(newUser.id, newUser);
            return Promise.resolve(newUser);
        }
    }
}
