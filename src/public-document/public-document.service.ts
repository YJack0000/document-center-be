import { Inject, Injectable, Logger } from '@nestjs/common';
import { IPublicDocumentRepository } from './public-document.interface';
import { PublicDocument } from './public-document.entity';
import { CreatePublicDocumentDto } from './dto/public-document.dto';

@Injectable()
export class PublicDocumentService {
    constructor(
        @Inject(IPublicDocumentRepository)
        private readonly publicdocumentRepository: IPublicDocumentRepository,
        private readonly logger: Logger,
    ) {
        this.logger = new Logger(PublicDocumentService.name);
    }

    async getPublicDocuments(): Promise<PublicDocument[]> {
        this.logger.log(`Get PublicDocuments`);
        return await this.publicdocumentRepository.findAll({ where: { public: true } });
    }

    async createPublicDocument(body: CreatePublicDocumentDto): Promise<string> {
        this.logger.log(`Create PublicDocument`);
        const publicdocument = this.publicdocumentRepository.create(body);
        const result = await this.publicdocumentRepository.save(publicdocument);

        return `PublicDocument created: ${result.id}`;
    }

    /*async updatePublicDocument(publicdocumentId: string, body: CreatePublicDocumentDto): Promise<string> {
        this.logger.log(`Update PublicDocument`);
        const publicdocument = await this.publicdocumentRepository.findOneById(publicdocumentId);
        if (!publicdocument) {
            return 'PublicDocument not found';
        }

        const updatedPublicDocument = this.publicdocumentRepository.create(body);
        updatedPublicDocument.id = publicdocumentId;
        await this.publicdocumentRepository.save(updatedPublicDocument);

        return `Document updated: ${publicdocumentId}`;
    }

    async deleteDocument(publicdocumentId: string): Promise<string> {
        this.logger.log(`Delete PublicDocument`);
        const publicdocument = await this.publicdocumentRepository.findOneById(publicdocumentId);
        if (!publicdocument) {
            return 'PublicDocument not found';
        }

        await this.publicdocumentRepository.remove(publicdocument);

        return `Document deleted: ${publicdocumentId}`;
    }*/
}