import { Test, TestingModule } from '@nestjs/testing';
import { PublicDocumentService } from './public-document.service';

describe('PublicDocumentService', () => {
  let service: PublicDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicDocumentService],
    }).compile();

    service = module.get<PublicDocumentService>(PublicDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
