import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DocumentModule } from './document/document.module';
import { Document } from './document/document.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ReviewModule } from './review/review.module';
import { Review } from './review/review.entity';
import { HelperModule } from './helper/helper.module';
import { UsersModule } from './users/users.module';
import { PublicDocumentModule } from './public-document/public-document.module';
import { PublicDocument } from './public-document/public-document.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/comment.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MinioService } from './minio/minio.service';
import { UploadImageModule } from './upload-image/upload-image.module';
import { MinioModule } from './minio/minio.module';
import { MailerModule } from 'nestjs-mailer';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

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
          entities: [Document, User, Review, PublicDocument, Comment],
        };
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    MailerModule.forRoot({
      config: {
        transport: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        },
      },
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
      ttl: 10 * 1000,
    }),
    DocumentModule,
    AuthModule,
    ReviewModule,
    HelperModule,
    UsersModule,
    PublicDocumentModule,
    CommentModule,
    UploadImageModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [AppService, MinioService],
})
export class AppModule {}
