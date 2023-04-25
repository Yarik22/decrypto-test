import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bcrypt from "bcryptjs"
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const PORT = process.env.PORT || 3001
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
  .setTitle('CryptoApp')
  .setDescription('Encoding & Decoding App')
  .setVersion('1.0.0')
  .build();
  const pas1 = "2233"
  const pas2 = "2233"
  const salt1 = await bcrypt.genSalt()
  const salt2 = await bcrypt.genSalt()
  const isPasswordEquals=await bcrypt.compare(  await bcrypt.hash(pas1,salt1),  await bcrypt.hash(pas2,salt2))
  console.log(isPasswordEquals)
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(PORT,()=>console.log(`Server is working on port ${PORT}`))
}
bootstrap();
