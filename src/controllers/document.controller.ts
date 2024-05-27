import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { Document } from '../document/document.entity';
import { CreateDocumentDto } from 'src/document/dto/document.dto';
import { UserGuard } from 'src/guard/user.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard, UserGuard)
  async getDocuments(@Req() req): Promise<Document[]> {
    return await this.documentService.getMyDocuments(req.user);
  }

  @Post('/me')
  @UseGuards(JwtAuthGuard, UserGuard)
  async createDocument(
    @Req() req,
    @Body() body: CreateDocumentDto,
  ): Promise<string> {
    return await this.documentService.createDocument(req.user, body);
  }

  @Get(':documentId')
  async getDocumentById(
    @Param('documentId') documentId: string,
  ): Promise<Document> {
    return await this.documentService.getDocumentById(documentId);
  }

  @Put(':documentId')
  @UseGuards(JwtAuthGuard, UserGuard)
  async updateDocument(
    @Req() req,
    @Param('documentId') documentId: string,
    @Body() body: CreateDocumentDto,
  ): Promise<string> {
    return await this.documentService.updateMyDocument(
      req.user,
      documentId,
      body,
    );
  }

  @Delete(':documentId')
  async deleteDocument(
    @Param('documentId') documentId: string,
  ): Promise<string> {
    return await this.documentService.deleteDocument(documentId);
  }
}
