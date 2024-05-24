import { Body, Controller, Delete, Get, Param, Post, Put, Query, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { Document } from '../document/document.entity';
import { CreateDocumentDto, UpdateDocumentStatusDto } from 'src/document/dto/document.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) { }

  @Get('/me')
  async getDocuments(): Promise<Document[]> {
    return await this.documentService.getDocuments();
  }
  @Post('/me')
  async createDocument(@Body() body: CreateDocumentDto): Promise<string> {
    return await this.documentService.createDocument(body);
  }

  @Get(':documentId')
  async getDocumentById(@Param('documentId') documentId: string): Promise<Document> {
    const document = await this.documentService.getDocumentById(documentId);
    if (!document) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    return document;
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
  @Get('assigned:ownerId')
  async getAssignedDocuments(@Param('ownerId') ownerId: string): Promise<Document[]> {
    return await this.documentService.getDocumentsByOwner(ownerId);
  }
  @Put('/status/:documentId')
  async updateDocumentStatus(
    @Param('documentId') documentId: string,
    @Body() updateDocumentStatusDto: UpdateDocumentStatusDto
  ): Promise<any> {
    const updated = await this.documentService.updateDocumentStatus(documentId, updateDocumentStatusDto);
    if (!updated) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Document Status updated' };
  }
}