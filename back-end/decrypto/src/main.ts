import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './pipes/validation.pipe';
import { GlobalExceptionFilter } from './filters/exception.filter';

async function bootstrap() {
  const PORT = process.env.PORT || 3001
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new GlobalExceptionFilter());
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
