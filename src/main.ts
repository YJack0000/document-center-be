import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('112 CloudNative API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        in: 'cookie',
        name: 'access_token',
      },
      'JWT-auth', // This name here is just an identifier for the security scheme
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      bathPath: '/api',
    },
  
  });

  await app.listen(3000);
}
bootstrap();
