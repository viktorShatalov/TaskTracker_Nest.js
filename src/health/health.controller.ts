import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service.js';

// Добавляет операции контроллера в отдельную группу Swagger.
@ApiTags('health')
// Назначает всем маршрутам контроллера префикс /health.
@Controller('health')
export class HealthController {
  // Внедряет клиент Prisma для проверки соединения с PostgreSQL.
  constructor(private readonly prisma: PrismaService) {}

  // Обрабатывает GET-запрос к /health.
  @Get()
  // Описывает маршрут в OpenAPI как проверку API и базы данных.
  @ApiOperation({ summary: 'Проверить доступность API и PostgreSQL' })
  // Проверяет доступность приложения и подключения к базе.
  async check() {
    // Выполняет простой запрос, чтобы убедиться, что PostgreSQL отвечает.
    await this.prisma.$queryRaw`SELECT 1`;
    // Возвращает результат проверки после успешного запроса к базе.
    return { status: 'ok', database: 'connected' };
  }
}