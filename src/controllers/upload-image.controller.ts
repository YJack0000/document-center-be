import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserGuard } from 'src/guard/user.guard';
import { UploadImageService } from 'src/upload-image/upload-image.service';

@Controller('upload-image')
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @Post()
  @UseGuards(JwtAuthGuard, UserGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res) {
    const fileName = await this.uploadImageService.uploadImage(file);
    return res.status(HttpStatus.OK).json({ fileName });
  }

  @Get('/:fileName')
  @UseGuards(JwtAuthGuard, UserGuard)
  async getImageStream(@Param('fileName') fileName: string, @Res() res) {
    const stream = await this.uploadImageService.getImageStream(fileName);
    stream.pipe(res);
  }

  @Delete('/:fileName')
  @UseGuards(JwtAuthGuard, UserGuard)
  async deleteImage(@Param('fileName') fileName: string, @Res() res) {
    await this.uploadImageService.deleteImage(fileName);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
