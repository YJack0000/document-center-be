import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadImageService } from 'src/upload-image/upload-image.service';

@Controller('upload-image')
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res) {
    const filename = await this.uploadImageService.uploadImage(file);
    return res.status(HttpStatus.OK).json({ filename });
  }

  @Get('/:fileName')
  async getImageUrl(@Param('fileName') fileName: string, @Res() res) {
    const result = await this.uploadImageService.getImageUrl(fileName);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete('/:fileName')
  async deleteImage(@Param('fileName') fileName: string) {
    return await this.uploadImageService.deleteImage(fileName);
  }
}
