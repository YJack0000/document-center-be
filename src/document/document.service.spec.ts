import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { IDocumentRepository } from './document.interface';
import { MockDocumentRepository } from '../mockRepositories/mockDocumentRepo';
import { Document } from './document.entity';
import { IReviewRepository } from 'src/review/review.interface';
import { MockReviewRepository } from 'src/mockRepositories/mockReviewRepo';
import { Logger } from '@nestjs/common';
import { HelperService } from 'src/helper/helper.service';
import { MockHelperService } from 'src/mockRepositories/mockHelperRepo';

describe('DocumentService', () => {
    let service: DocumentService;
    let mockDocumentRepository: MockDocumentRepository;
    let mockReviewRepository: MockReviewRepository;
    let mockHelperService: HelperService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentService,
                {
                    provide: IDocumentRepository,
                    useClass: MockDocumentRepository
                },
                {
                    provide: IReviewRepository,
                    useClass: MockReviewRepository
                },
                {
                    provide: Logger,
                    useValue: {
                        log: jest.fn(),
                        error: jest.fn(),
                        warn: jest.fn(),
                        debug: jest.fn(),
                        verbose: jest.fn()
                    }
                },
                {
                    provide: HelperService,
                    useClass: MockHelperService
                }
            ],
        }).compile();

        service = module.get<DocumentService>(DocumentService);
        mockDocumentRepository = module.get<IDocumentRepository>(IDocumentRepository) as unknown as MockDocumentRepository;
        mockReviewRepository = module.get<IReviewRepository>(IReviewRepository) as unknown as MockReviewRepository;
        mockHelperService = module.get<HelperService>(HelperService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(mockDocumentRepository).toBeDefined();
        expect(mockReviewRepository).toBeDefined();
        expect(mockHelperService).toBeDefined();
    });

    describe('createDocument', () => {
        it('Successfully create a document', async () => {
            const documentDto = { title: 'Test Document', content: 'Test content' };
            const userReq = { id: 'user1' };
            const createdDocument = await service.createDocument(userReq as any, documentDto);

            expect(createdDocument.title).toBe(documentDto.title);
            expect(createdDocument.content).toBe(documentDto.content);
            expect(createdDocument.ownerId).toBe(userReq.id);
            expect(mockDocumentRepository.documents).toContainEqual(expect.objectContaining({
                title: documentDto.title,
                content: documentDto.content,
                ownerId: userReq.id
            }));
        });
    });

    describe('updateMyDocument', () => {
        it('Update an existing document', async () => {
            const document = new Document();
            document.id = 'doc1';
            document.title = 'Original Title';
            document.content = 'Original Content';
            document.ownerId = 'user1';
            mockDocumentRepository.documents.push(document);

            const updateDto = { title: 'Updated Title', content: 'Updated Content' };
            const updatedDocument = await service.updateMyDocument({ id: 'user1' } as any, 'doc1', updateDto);

            expect(updatedDocument.title).toBe(updateDto.title);
            expect(updatedDocument.content).toBe(updateDto.content);
        });
    });

    describe('deleteMyDocument', () => {
        it('Delete a document', async () => {
            const document = new Document();
            document.id = 'doc2';
            document.title = 'Document to Delete';
            document.content = 'Content of document to delete';
            document.ownerId = 'user2';
            mockDocumentRepository.documents.push(document);

            await service.deleteMyDocument({ id: 'user2' } as any, 'doc2');
            const foundDocument = mockDocumentRepository.documents.find(doc => doc.id === 'doc2');

            expect(foundDocument).toBeUndefined();
        });
        it('should throw an error if the document to delete is not found', async () => {
            jest.spyOn(mockDocumentRepository, 'removeById').mockImplementation(async () => { throw new Error('Document not found'); });
            await expect(service.deleteMyDocument({ id: 'user2' } as any, 'non-existing-doc'))
                .rejects.toThrow('Document not found');
        });
    });

    describe('getDocumentById', () => {
        it('Return a document by ID', async () => {
            const document = new Document();
            document.id = 'doc3';
            document.title = 'Document to Retrieve';
            document.content = 'Content of document to retrieve';
            document.ownerId = 'user3';
            mockDocumentRepository.documents.push(document);

            const retrievedDocument = await service.getDocumentById('doc3');

            expect(retrievedDocument).toEqual(document);
        });
    });

    describe('changeDocumentStatus', () => {
        it('should throw an error if the user is neither an owner nor a reviewer', async () => {
            jest.spyOn(mockHelperService, 'checkIsReviewerOrOwner').mockResolvedValueOnce('none');
            const statusUpdateDto = { status: 'edit' };

            await expect(service.changeDocumentStatus({ id: 'user1' } as any, 'doc1', statusUpdateDto))
                .rejects.toThrow('You are not the owner or reviewer');
        });

    });

    describe('getAllDocuments', () => {
        it('should return paginated result', async () => {
            const paginationDto = { page: 1, limit: 5 };
            jest.spyOn(mockDocumentRepository, 'findAll').mockResolvedValueOnce([new Document()]);
            jest.spyOn(mockDocumentRepository, 'count').mockResolvedValueOnce(10);

            const result = await service.getAllDocuments(paginationDto);
            expect(result.data.length).toBe(1);
            expect(result.totalPage).toBe(2);
        });

        it('should return empty data if no documents are found', async () => {
            jest.spyOn(mockDocumentRepository, 'findAll').mockResolvedValueOnce([]);
            jest.spyOn(mockDocumentRepository, 'count').mockResolvedValueOnce(0);

            const paginationDto = { page: 1, limit: 5 };
            const result = await service.getAllDocuments(paginationDto);
            expect(result.data.length).toBe(0);
            expect(result.totalPage).toBe(0);
        });
    });

});
