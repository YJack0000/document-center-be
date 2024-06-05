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
import { CacheModule } from '@nestjs/cache-manager';
import { PaginationReqDto } from 'src/common/pagination.dto';
import { UserReq } from 'src/strategy/jwt.strategy';
import { IPublicDocumentRepository } from 'src/public-document/public-document.interface';

describe('DocumentService', () => {
    let service: DocumentService;
    let mockDocumentRepository: MockDocumentRepository;
    let mockReviewRepository: MockReviewRepository;
    let mockHelperService: MockHelperService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CacheModule.register({
                    store: 'memory',
                    ttl: 600,
                }),
            ],
            providers: [
                DocumentService,
                {
                    provide: IDocumentRepository,
                    useClass: MockDocumentRepository,
                },
                {
                    provide: IReviewRepository,
                    useValue: new MockReviewRepository() as unknown as IReviewRepository,
                },
                {
                    provide: IPublicDocumentRepository,
                    useValue: new MockReviewRepository() as unknown as IPublicDocumentRepository,
                },
                {
                    provide: Logger,
                    useValue: {
                        log: jest.fn(),
                        error: jest.fn(),
                        warn: jest.fn(),
                        debug: jest.fn(),
                        verbose: jest.fn(),
                    },
                },
                {
                    provide: HelperService,
                    useClass: MockHelperService,
                },
            ],
        }).compile();

        service = module.get<DocumentService>(DocumentService);
        mockDocumentRepository = module.get<IDocumentRepository>(IDocumentRepository) as MockDocumentRepository;
        mockReviewRepository = module.get<MockReviewRepository>(IReviewRepository) as MockReviewRepository;
        mockHelperService = module.get<HelperService>(HelperService) as MockHelperService;
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
            const createdDocument = await service.createDocument(
                userReq as any,
                documentDto,
            );

            expect(createdDocument.title).toBe(documentDto.title);
            expect(createdDocument.content).toBe(documentDto.content);
            expect(createdDocument.ownerId).toBe(userReq.id);
            expect(mockDocumentRepository.documents).toContainEqual(
                expect.objectContaining({
                    title: documentDto.title,
                    content: documentDto.content,
                    ownerId: userReq.id,
                }),
            );
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
            const updatedDocument = await service.updateMyDocument(
                { id: 'user1' } as any,
                'doc1',
                updateDto,
            );

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
            document.status = 'active';
            mockDocumentRepository.documents.push(document);

            await service.deleteMyDocument({ id: 'user2' } as any, 'doc2');
            const foundDocument = mockDocumentRepository.documents.find(doc => doc.id === 'doc2');

            expect(foundDocument.status).toBe('delete');
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


        it('Throws error if document is not found', async () => {
            await expect(service.getDocumentById('nonexistent'))
                .rejects.toThrow('Document not found');
        });
    });
    describe('getAllDocuments', () => {
        it('Successfully get all documents with pagination', async () => {
            const paginationDto = new PaginationReqDto();
            paginationDto.page = 1;
            paginationDto.limit = 10;
            const result = await service.getAllDocuments(paginationDto);
            expect(result.data).toBeInstanceOf(Array);
            expect(result.page).toEqual(paginationDto.page);
            expect(result.limit).toEqual(paginationDto.limit);
            expect(result.totalPage).toBeDefined();
        });
    });

    describe('getMyDocuments', () => {
        it('Successfully get my documents with pagination', async () => {
            const userReq: UserReq = { id: 'user1', email: 'test@gmail.com', name: 'Test User', isSuperUser: false };
            const paginationDto = new PaginationReqDto();
            paginationDto.page = 1;
            paginationDto.limit = 10;
            const result = await service.getMyDocuments(userReq, paginationDto);
            expect(result.data).toBeInstanceOf(Array);
            expect(result.page).toEqual(paginationDto.page);
            expect(result.limit).toEqual(paginationDto.limit);
            expect(result.totalPage).toBeDefined();
        });
    });

    describe('getDocumentsAssignedToMe', () => {
        it('Successfully get documents assigned to me with pagination', async () => {
            const userReq: UserReq = { id: 'user1', email: 'test@gmail..com', name: 'Test User', isSuperUser: false };
            const paginationDto = new PaginationReqDto();
            paginationDto.page = 1;
            paginationDto.limit = 10;
            const result = await service.getDocumentsAssignedToMe(userReq, paginationDto);
            expect(result.data).toBeInstanceOf(Array);
            expect(result.page).toEqual(paginationDto.page);
            expect(result.limit).toEqual(paginationDto.limit);
            expect(result.totalPage).toBeDefined();
        });
    });

});
