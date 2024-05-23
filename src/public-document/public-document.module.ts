import { Logger, Module } from '@nestjs/common';
import { PublicDocumentService } from './public-document.service';
import { PublicDocumentController } from '../controllers/public-document.controller';
import { PublicDocumentRepository } from 'src/repositories/public-document.repository';
import { IPublicDocumentRepository } from './public-document.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicDocument } from './public-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicDocument])],
  providers: [
    PublicDocumentService,
    {
      provide: IPublicDocumentRepository,
      useClass: PublicDocumentRepository,
    },
    Logger,
  ],
  controllers: [PublicDocumentController],
})
export class PublicDocumentModule { }