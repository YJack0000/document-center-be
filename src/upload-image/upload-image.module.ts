import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from '../controllers/upload-image.controller';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  imports: [MinioModule],
  providers: [UploadImageService],
  controllers: [UploadImageController]
})
export class UploadImageModule {}
