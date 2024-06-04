import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PaginationReqDto, PaginationResDto } from 'src/common/pagination.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserGuard } from 'src/guard/user.guard';
import { UpdatePublicDocumentStatusDto } from 'src/public-document/dto/public-document.dto';
import { PublicDocument } from 'src/public-document/public-document.entity';
import { PublicDocumentService } from 'src/public-document/public-document.service';

@Controller('documents/public')
export class PublicDocumentController {
  constructor(private readonly publicDocumentService: PublicDocumentService) {}

  @Get('/all')
  async getAllPublicDocuments(
    @Query(new ValidationPipe({ transform: true })) query: PaginationReqDto,
    @Res() res,
  ): Promise<PaginationResDto<PublicDocument>> {
    const result =
      await this.publicDocumentService.getAllPublicDocuments(query);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get("/me")
  @UseGuards(JwtAuthGuard, UserGuard)
  async getMyPublicDocuments(
    @Req() req,
    @Query(new ValidationPipe({ transform: true })) query: PaginationReqDto,
    @Res() res,
  ): Promise<PaginationResDto<PublicDocument>> {
    const result = await this.publicDocumentService.getPublicDocumentsByUserId(
      req.user.id,
      query,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/:userId')
  async getPublicDocumentsByUserId(
    @Param('userId') userId: string,
    @Query(new ValidationPipe({ transform: true })) query: PaginationReqDto,
    @Res() res,
  ): Promise<PaginationResDto<PublicDocument>> {
    const result = await this.publicDocumentService.getPublicDocumentsByUserId(
      userId,
      query,
    );
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
