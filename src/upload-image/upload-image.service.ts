import { Injectable } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class UploadImageService {
    constructor(
        private readonly minio: MinioService
    ) {}

    async uploadImage(file: Express.Multer.File) {
        await this.minio.createBucketIfNotExists();
        return await this.minio.uploadFile(file);
    }

    async getImageUrl(fileName: string) {
				return await this.minio.getFileUrl(fileName);
		}

		async deleteImage(fileName: string) {
				return await this.minio.deleteFile(fileName);
		}
}