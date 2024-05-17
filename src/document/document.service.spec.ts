import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { IDocumentRepository } from './document.interface';
import { Logger } from '@nestjs/common';

// TODO: Create mock repository
class MockDocumentRepository {}

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: IDocumentRepository,
          useClass: MockDocumentRepository,
        },
        Logger,
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
