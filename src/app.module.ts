import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthController } from './health/health.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { TasksModule } from './tasks/tasks.module.js';

// Объявляет корневой модуль NestJS и его зависимости.
@Module({
  // Регистрирует модули, доступные приложению.
  imports: [
    // Загружает переменные окружения из .env и делает ConfigService глобальным.
    ConfigModule.forRoot({ isGlobal: true }),
    // Регистрирует общий PrismaService для доступа к PostgreSQL.
    PrismaModule,
    // Подключает API проектов.
    ProjectsModule,
    // Подключает API задач.
    TasksModule,
  ],
  // Регистрирует корневой контроллер и endpoint проверки состояния.
  controllers: [AppController, HealthController],
  // Регистрирует провайдеры бизнес-логики.
  providers: [AppService],
})
// Экспортирует корневой модуль для запуска NestJS.
export class AppModule {}
