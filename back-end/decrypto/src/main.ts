import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  const PORT = process.env.PORT || 3001
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('CryptoApp')
  .setDescription('Encoding & Decoding App')
  .setVersion('1.0.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(PORT,()=>console.log(`Server is working on port ${PORT}`))
}
bootstrap();
