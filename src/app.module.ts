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
          entities: [Document, User, Review],
        };
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    DocumentModule,
    AuthModule,
    ReviewModule,
    HelperModule,
    UsersModule,
    PublicDocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
