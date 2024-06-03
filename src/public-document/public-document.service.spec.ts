// publicdocument.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PublicDocumentService } from './public-document.service';
import { PublicDocument } from './public-document.entity';
import { mockPublicDocumentRepository } from '../mockRepositories/mockPublicDocument';
import { IPublicDocumentRepository } from './public-document.interface';
import { PaginationReqDto } from 'src/common/pagination.dto';
import { Logger } from '@nestjs/common';
import { HelperService } from 'src/helper/helper.service';
import { BaseInterfaceRepository } from 'src/common/base.interface';
import { IDocumentRepository } from 'src/document/document.interface';
import { UserReq } from 'src/strategy/jwt.strategy';
import { PaginationResDto } from 'src/common/pagination.dto';
import { Document } from '../document/document.entity';
import { CacheModule } from '@nestjs/cache-manager';

describe('PublicDocumentService', () => {
    let service: PublicDocumentService;
    let mockPublicDocumentRepository: IPublicDocumentRepository;
    let mockHelperService: HelperService;
    let mockDocumentRepository: IDocumentRepository;

    beforeEach(async () => {
        const mockPublicDocumentRepository = {
            count: jest.fn().mockResolvedValue(100), // Simulate 100 documents total
            findAll: jest.fn().mockResolvedValue([
              { id: '1', title: 'Document 1', content: 'Content 1', updateAt: new Date(), owner: { id: 'owner1', name: 'Owner 1' }},
              { id: '2', title: 'Document 2', content: 'Content 2', updateAt: new Date(), owner: { id: 'owner2', name: 'Owner 2' }}
            ]) // Simulate finding documents
          };
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CacheModule.register({
                    store: 'memory',
                    ttl: 600,
                }),
            ],
            providers: [
                PublicDocumentService,
                { provide: IPublicDocumentRepository, useValue: mockPublicDocumentRepository },
                { provide: HelperService, useValue: mockHelperService },
                { provide: IDocumentRepository, useValue: mockDocumentRepository },
                Logger,
            ],
        }).compile();

        service = module.get<PublicDocumentService>(PublicDocumentService);
        //mockPublicDocumentRepository = module.get<IPublicDocumentRepository>(IPublicDocumentRepository);
        mockHelperService = module.get<HelperService>(HelperService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllPublicDocuments', () => {
        it('should return a paginated list of public documents', async () => {
            const query: PaginationReqDto = { page: 1, limit: 10 };
            const result: PaginationResDto<PublicDocument> = await service.getAllPublicDocuments(query);
        
            expect(result).toBeDefined();
            expect(result.data.length).toBe(2);
            expect(result.page).toBe(query.page);
            expect(result.limit).toBe(query.limit);
            expect(result.totalPage).toBe(10); // 100 documents total / 10 per page
        });
    });

    describe('getAllPublicDocumentgetPublicDocumentsByUserId', () => {
        it('should return paginated public documents for a specific user', async () => {
            const userId = 'user1';
            const query: PaginationReqDto = { page: 2, limit: 10 };
            const expectedResult: PaginationResDto<PublicDocument> = await service.getPublicDocumentsByUserId(userId, query);
            
            expect(expectedResult).toBeDefined();
            expect(expectedResult.data.length).toBe(2);
            expect(expectedResult.page).toBe(query.page);
            expect(expectedResult.limit).toBe(query.limit);
            expect(expectedResult.totalPage).toBe(10); // 20 total / 10 per page
          });
    });
});
