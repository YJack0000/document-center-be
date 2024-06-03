import { Test, TestingModule } from '@nestjs/testing';
import { HelperService } from './helper.service';
import { MockHelperService } from '../mockRepositories/mockHelperRepo';
import { IDocumentRepository } from '../document/document.interface';
import { IReviewRepository } from '../review/review.interface';
import { MockReviewRepository } from 'src/mockRepositories/mockReviewRepo';
import { MockDocumentRepository } from '../mockRepositories/mockDocumentRepo';

describe('HelperService', () => {
    let service: HelperService;
    let mockDocumentRepository: MockDocumentRepository;
    let mockReviewRepository: MockReviewRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HelperService,
                {
                    provide: IDocumentRepository,
                    useClass: MockDocumentRepository
                },
                {
                    provide: IReviewRepository,
                    useClass: MockReviewRepository
                },
                {
                    provide: HelperService,
                    useClass: MockHelperService
                }
            ],
        }).compile();

        service = module.get<HelperService>(HelperService);6
        mockDocumentRepository = module.get<IDocumentRepository>(IDocumentRepository) as unknown as MockDocumentRepository;
        mockReviewRepository = module.get<IReviewRepository>(IReviewRepository) as unknown as MockReviewRepository;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(mockDocumentRepository).toBeDefined();
        expect(mockReviewRepository).toBeDefined();
    });

    describe('checkOwnership', () => {
        it('Check Ownership', async () => {
            const userReq = {
                id: 'user1',
                name: 'Emily',
                email: 'emily@gmail.com',
                isSuperUser: false,
              };

            const documentId = 'doc1';
            const result = await service.checkOwnership(userReq, documentId);
            expect(result).toBeUndefined();
            });
    });

    describe('checkIsReviewerOrOwner', () => {
        it('should return "reviewer" if user is a reviewer with "wait" status', async () => {
            const userReq = {
                id: 'user1',
                name: 'Emily',
                email: 'emily@gmail.com',
                isSuperUser: false,
              };
            const documentId = 'doc1';

            const result = await service.checkIsReviewerOrOwner(userReq, documentId);
            expect(result).toEqual('owner');
          });
    })

    describe('changeDocumentStatus', () => {
        it('should update the document status', async () => {
            const documentId = 'doc1';
            const newStatus = 'approved';
        
            await service.changeDocumentStatus(documentId, newStatus);
        
            expect(service.changeDocumentStatus).toHaveBeenCalledWith("doc1", "approved");
          });
    })
});
