import { Test, TestingModule } from '@nestjs/testing';
import { UploadImageService } from './upload-image.service';
import { mockUploadImageRepo } from '../mockRepositories/mockUploadImageRepo';
import { MinioService } from 'src/minio/minio.service';
import { mockMinioRepo } from 'src/mockRepositories/mockMinioRepo';

describe('UploadImageService', () => {
    let service: UploadImageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UploadImageService,
                {
                    provide: 'IMAGE_REPOSITORY',
                    useValue: mockUploadImageRepo,
                },
                {
                    provide: MinioService,  // Use the correct injection token
                    useValue: mockMinioRepo,
                },
            ],
        }).compile();

        service = module.get<UploadImageService>(UploadImageService);
        
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('uploadImage', () => {
        it('should call upload method and return the result', async () => {
            const fileName = 'test-file.txt';
            const expectedResult = 'test-file.txt';
            const mockFile = { originalname: 'test.jpg', buffer: Buffer.from('test'), size: Buffer.from('test').length, 
            mimetype: 'image/jpeg', fieldname: 'file', encoding: '7bit', destination: '', filename: fileName, path: '', stream: null
            };
            mockUploadImageRepo.uploadImage.mockResolvedValue(mockFile);
            mockMinioRepo.uploadFile.mockResolvedValue(expectedResult);

            const result = await service.uploadImage(mockFile);

            expect(mockMinioRepo.createBucketIfNotExists).toHaveBeenCalled();
            expect(mockMinioRepo.uploadFile).toHaveBeenCalledWith(mockFile);
            expect(result).toEqual(fileName);
        });
    });

    describe('deleteImage', () => {
        it('should call delete method', async () => {
            const imageUrl = 'http://example.com/test.jpg';
            mockUploadImageRepo.deleteImage.mockResolvedValue(true);
            mockMinioRepo.deleteFile.mockResolvedValue(undefined);

            const result = await service.deleteImage(imageUrl);

            expect(mockMinioRepo.deleteFile).toHaveBeenCalledWith(imageUrl);
            expect(result).toBe(undefined);
        });
    });

    describe('getImageUrl', () => {
        it('should call get file url method', async () => {
            const imageUrl = 'http://example.com/test.jpg';
            const expectedResult = 'http://example.com/test.jpg';
            mockUploadImageRepo.getImageUrl.mockResolvedValue(imageUrl);
            mockMinioRepo.getFileUrl.mockResolvedValue(expectedResult);

            const result = await service.getImageUrl(imageUrl);

            expect(mockMinioRepo.getFileUrl).toHaveBeenCalledWith(imageUrl);
            expect(result).toBe(expectedResult);
        });
    });
});
