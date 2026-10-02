import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { API_DESCRIPTION, API_TITLE, API_VERSION, DEFAULT_API_HOST, DEFAULT_API_PORT } from './shared/config/app.constants.js';

// Запускает настройку и старт HTTP-приложения.
async function bootstrap() {
  // Создаёт экземпляр HTTP-приложения NestJS.
  const app = await NestFactory.create(AppModule);
  // Проверяет DTO, удаляет неизвестные поля и преобразует типы запроса.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Формирует метаданные документации OpenAPI.
  const swaggerConfig = new DocumentBuilder()
    .setTitle(API_TITLE)
    .setDescription(API_DESCRIPTION)
    .setVersion(API_VERSION)
    .build();
  // Создаёт OpenAPI-схему по контроллерам и DTO.
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // Публикует интерактивную документацию на /docs.
  SwaggerModule.setup('docs', app, document);
  // Запускает сервер на порту из окружения или на порту 3000.
  await app.listen(process.env.PORT ?? DEFAULT_API_PORT, DEFAULT_API_HOST);
}
// Немедленно запускает приложение при исполнении этого файла.
await bootstrap();
