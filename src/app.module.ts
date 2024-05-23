import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DocumentModule } from './document/document.module';
import { Document } from './document/document.entity';
import { PublicDocumentModule } from './public-document/public-document.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          synchronize: true,
          host: 'localhost',
          entities: [Document],
        };
      },
    }),
    DocumentModule,
    PublicDocumentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
