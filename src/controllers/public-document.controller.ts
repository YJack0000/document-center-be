import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserGuard } from 'src/guard/user.guard';
import { UpdatePublicDocumentStatusDto } from 'src/public-document/dto/public-document.dto';
import { PublicDocumentService } from 'src/public-document/public-document.service';

@Controller('documents/public')
export class PublicDocumentController {
  constructor(private readonly publicDocumentService: PublicDocumentService) {}

  @Get('/all')
  async getAllPublicDocuments(@Res() res) {
    const result = await this.publicDocumentService.getAllPublicDocuments();
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/:userId')
  async getPublicDocumentsByUserId(
    @Param('userId') userId: string,
    @Res() res,
  ) {
    const result =
      await this.publicDocumentService.getPublicDocumentsByUserId(userId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('/:documentId')
  @UseGuards(JwtAuthGuard, UserGuard)
  async publishDocument(
    @Req() req,
    @Param('documentId') documentId: string,
    @Body() body: UpdatePublicDocumentStatusDto,
    @Res() res,
  ) {
    const result = await this.publicDocumentService.updatePublicDocumentStatus(
      req.user,
      documentId,
      body,
    );

    return res.status(HttpStatus.OK).json(result);
  }
}
