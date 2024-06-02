import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { IUserRepository } from 'src/users/user.interface';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { mockAuthRepo } from 'src/mockRepositories/mockAuthRepo';
import { InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(() => 'mockedJwtToken'),
                    },
                },
                {
                    provide: IUserRepository,
                    useValue: mockAuthRepo,
                },
                Logger,
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signIn', () => {
        it('should return a JWT when user exists', async () => {
            const userReq = { id: 'user1', email: 'test@example.com', name: 'Test User', isSuperUser: false};
            mockAuthRepo.findOne.mockResolvedValue(userReq);

            const result = await service.signIn(userReq);
            expect(result).toEqual('mockedJwtToken');
            expect(jwtService.sign).toHaveBeenCalled();
        });

        it('should register a new user if not found', async () => {
            const userReq = { id: 'user1', email: 'new@example.com', name: 'New User', isSuperUser: false};
            mockAuthRepo.findOne.mockResolvedValue(null);
            mockAuthRepo.create.mockImplementation((user) => user);
            mockAuthRepo.save.mockResolvedValue({ ...userReq, id: '2' });
            
            const result = await service.signIn(userReq);
            expect(result).toEqual('mockedJwtToken');
            expect(mockAuthRepo.create).toHaveBeenCalledWith(userReq);
            expect(mockAuthRepo.save).toHaveBeenCalled();
            expect(jwtService.sign).toHaveBeenCalled();
        });
    });

    describe('registerUser', () => {
        it('should successfully register a new user and return a JWT', async () => {
            const userReq = { id: 'user1', email: 'new@example.com', name: 'New User', isSuperUser: false};
            mockAuthRepo.create.mockReturnValue(userReq);
            mockAuthRepo.save.mockResolvedValue({ ...userReq, id: '1' });

            const result = await service.registerUser(userReq);
            expect(mockAuthRepo.create).toHaveBeenCalledWith(userReq);
            expect(mockAuthRepo.save).toHaveBeenCalledWith(userReq);
            expect(result).toEqual('mockedJwtToken');
            expect(jwtService.sign).toHaveBeenCalled();
        });

        it('should throw an InternalServerErrorException when the database operation fails', async () => {
            const userReq = { id: 'user1', email: 'fail@example.com', name: 'Fail User', isSuperUser: false};
            mockAuthRepo.save.mockRejectedValue(new Error('Database error'));

            await expect(service.registerUser(userReq)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findUserByEmail', () => {
        it('should return the user if they exist', async () => {
            const email = 'test@example.com';
            const expectedUser = { email, name: 'Test User', id: '1' };
            mockAuthRepo.findOne.mockResolvedValue(expectedUser);

            const result = await service.findUserByEmail(email);
            expect(result).toEqual(expectedUser);
        });

        it('should return null if the user does not exist', async () => {
            const email = 'notfound@example.com';
            mockAuthRepo.findOne.mockResolvedValue(null);

            const result = await service.findUserByEmail(email);
            expect(result).toBeNull();
        });
    });

    
});