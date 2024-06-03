import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { Document } from '../document/document.entity';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  UpdateStatusDto,
} from 'src/document/dto/document.dto';
import { UserGuard } from 'src/guard/user.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { PaginationReqDto, PaginationResDto } from 'src/common/pagination.dto';
import { SuperUserGuard } from 'src/guard/super-user.guard';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard, SuperUserGuard)
  async getAllDocuments(
    @Query(new ValidationPipe({ transform: true })) query: PaginationReqDto,
    @Res() res,
  ): Promise<PaginationResDto<Document>> {
    const result = await this.documentService.getAllDocuments(query);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard, UserGuard)
  async getDocuments(
    @Req() req,
    @Query(new ValidationPipe({ transform: true })) query: PaginationReqDto,
    @Res() res,
  ): Promise<PaginationResDto<Document>> {
    const result = await this.documentService.getMyDocuments(req.user, query);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/me')
  @UseGuards(JwtAuthGuard, UserGuard)
  async createDocument(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) body: CreateDocumentDto,
    @Res() res,
  ) {
    const result = await this.documentService.createDocument(req.user, body);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Get('/:documentId')
  async getDocumentById(@Param('documentId') documentId: string, @Res() res) {
    const result = await this.documentService.getDocumentById(documentId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('/:documentId')
  @UseGuards(JwtAuthGuard, UserGuard)
  async updateDocument(
    @Req() req,
    @Param('documentId') documentId: string,
    @Body(new ValidationPipe({ transform: true })) body: UpdateDocumentDto,
    @Res() res,
  ) {
    const result = await this.documentService.updateMyDocument(
      req.user,
      documentId,
      body,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete('/:documentId')
  @UseGuards(JwtAuthGuard, UserGuard)
  async deleteDocument(
    @Req() req,
    @Param('documentId') documentId: string,
    @Res() res,
  ) {
    await this.documentService.deleteMyDocument(req.user, documentId);
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get('/assigned/me')
  @UseGuards(JwtAuthGuard, UserGuard)
  async getDocumentsAssignedToMe(
    @Req() req,
    @Query(new ValidationPipe({ transform: true })) query: PaginationReqDto,
    @Res() res,
  ): Promise<PaginationResDto<Document>> {
    const result = await this.documentService.getDocumentsAssignedToMe(
      req.user,
      query,
    );
    return res.status(HttpStatus.OK).json(result);
  }
}
