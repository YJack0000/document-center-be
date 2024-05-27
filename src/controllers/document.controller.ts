import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { Document } from '../document/document.entity';
import { CreateDocumentDto } from 'src/document/dto/document.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get("/me")
  async getDocuments(): Promise<Document[]> {
    return await this.documentService.getDocuments();
  }

  @Post("/me")
  async createDocument(@Body() body: CreateDocumentDto): Promise<string> {
    return await this.documentService.createDocument(body);
  }

  @Put(':documentId')
  async updateDocument(
    @Param('documentId') documentId: string,
    @Body() body: CreateDocumentDto,
  ): Promise<string> {
    return await this.documentService.updateDocument(documentId, body);
  }

  @Delete(':documentId')
  async deleteDocument(@Param('documentId') documentId: string): Promise<string> {
    return await this.documentService.deleteDocument(documentId);
  }
}
