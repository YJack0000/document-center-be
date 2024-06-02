import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserRepository } from './user.interface';
import { MockUserRepository } from '../mockRepositories/mockUserRepo';
import { User } from './user.entity';

describe('UsersService', () => {
    let service: UsersService;
    let mockRepository: IUserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: IUserRepository,
                    useClass: MockUserRepository,
                },
                Logger,
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        mockRepository = module.get<IUserRepository>(IUserRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(mockRepository).toBeDefined();
    });

    it('should return all users', async () => {
        const result = await service.getAllUsers({ page: 1, limit: 10 });
        expect(result.data.length).toBe(10);

        expect(result.totalPage).toBe(1); 

    });

    it('should return a user by ID', async () => {
        const result = await service.getUserById('user1');
        expect(result.email).toBe('user1@gmail.com');
    });
});
