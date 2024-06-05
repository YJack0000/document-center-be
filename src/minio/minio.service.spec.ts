import { Test, TestingModule } from '@nestjs/testing';
import { MinioService } from './minio.service';
import { mockMinioRepo } from '../mockRepositories/mockMinioRepo';
import { InjectionToken } from '@nestjs/common';
import * as Minio from 'minio';

describe('MinioService', () => {
  let service: MinioService;
  //let minioClient = new Client({ endPoint: 'localhost', port: 9000, useSSL: false, accessKey: 'minio', secretKey: 'minio'});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinioService,
        {
          provide: MinioService, // Use the correct injection token
          useValue: mockMinioRepo,
        },
      ],
    }).compile();

    service = module.get<MinioService>(MinioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBucketIfNotExists', () => {
    it('should create a bucket if it does not already exist', async () => {
      mockMinioRepo.createBucketIfNotExists.mockResolvedValue(undefined); // Simulate success

      await service.createBucketIfNotExists();
      expect(mockMinioRepo.createBucketIfNotExists).toHaveBeenCalled();
    });
  });

  describe('getFileUrl', () => {
    it('should get a file URL', async () => {
      const bucketName = 'test-bucket';
      const fileName = 'test-file.txt';
      const expectedUrl = `http://${bucketName}/${fileName}`;

      mockMinioRepo.getFileStream.mockResolvedValue(expectedUrl);

      const result = await service.getFileStream(fileName);
      expect(mockMinioRepo.getFileStream).toHaveBeenCalledWith(fileName);
      expect(result).toEqual(expectedUrl);
    });
  });

  describe('uploadFile', () => {
    it('should upload a file and return some identifier', async () => {
      const fileName = 'test-file.txt';
      const expectedResult = 'test-file.txt';
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
        size: Buffer.from('test').length,
        mimetype: 'image/jpeg',
        fieldname: 'file',
        encoding: '7bit',
        destination: '',
        filename: fileName,
        path: '',
        stream: null,
      };

      mockMinioRepo.uploadFile.mockResolvedValue(expectedResult);

      const result = await service.uploadFile(mockFile);
      expect(mockMinioRepo.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      const fileName = 'test-file.txt';

      mockMinioRepo.deleteFile.mockResolvedValue(undefined); // Simulate success

      await service.deleteFile(fileName);
      expect(mockMinioRepo.deleteFile).toHaveBeenCalledWith(fileName);
    });
  });
});
