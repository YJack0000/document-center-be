import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PublicDocumentService } from '../public-document/public-document.service';
import { PublicDocument } from '../public-document/public-document.entity';
import { CreateDocumentDto } from 'src/document/dto/document.dto';
import { CreatePublicDocumentDto } from 'src/public-document/dto/public-document.dto';

@Controller('documents/public')
export class PublicDocumentController {
    constructor(private readonly publicdocumentService: PublicDocumentService) { }

    @Get()
    async getPublicDocuments(): Promise<PublicDocument[]> {
        return await this.publicdocumentService.getPublicDocuments();
    }

    @Post()
    async createPublicDocument(@Body() body: CreatePublicDocumentDto): Promise<string> {
        return await this.publicdocumentService.createPublicDocument(body);
    }

}
