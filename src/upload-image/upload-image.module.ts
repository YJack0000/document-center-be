import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from '../controllers/upload-image.controller';

@Module({
  providers: [UploadImageService],
  controllers: [UploadImageController]
})
export class UploadImageModule {}
