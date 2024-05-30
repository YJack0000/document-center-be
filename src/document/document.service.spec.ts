import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { IDocumentRepository } from './document.interface';
import { MockDocumentRepository } from '../mockRepositories/mockDocumentRepo';
import { Document } from './document.entity';

describe('DocumentService', () => {
    let service: DocumentService;
    let mockRepository: MockDocumentRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentService,
                {
                    provide: IDocumentRepository,
                    useClass: MockDocumentRepository
                },
            ],
        }).compile();

        service = module.get<DocumentService>(DocumentService);
        mockRepository = module.get<IDocumentRepository>(IDocumentRepository) as unknown as MockDocumentRepository;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(mockRepository).toBeDefined();
    });

    describe('createDocument', () => {
        it('Successfully create a document', async () => {
            const documentDto = { title: 'Test Document', content: 'Test content' };
            const userReq = { id: 'user1' };
            const createdDocument = await service.createDocument(userReq as any, documentDto);

            expect(createdDocument.title).toBe(documentDto.title);
            expect(createdDocument.content).toBe(documentDto.content);
            expect(createdDocument.ownerId).toBe(userReq.id);
            expect(mockRepository.documents).toContainEqual(expect.objectContaining({
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
            mockRepository.documents.push(document);

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
            mockRepository.documents.push(document);

            await service.deleteMyDocument({ id: 'user2' } as any, 'doc2');
            const foundDocument = mockRepository.documents.find(doc => doc.id === 'doc2');

            expect(foundDocument).toBeUndefined();
        });
    });

    describe('getDocumentById', () => {
        it('Return a document by ID', async () => {
            const document = new Document();
            document.id = 'doc3';
            document.title = 'Document to Retrieve';
            document.content = 'Content of document to retrieve';
            document.ownerId = 'user3';
            mockRepository.documents.push(document);

            const retrievedDocument = await service.getDocumentById('doc3');

            expect(retrievedDocument).toEqual(document);
        });
    });

});
