import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';

// Регистрирует контроллеры и провайдеры модуля проектов.
@Module({
  // Подключает HTTP-маршруты проектов.
  controllers: [ProjectsController],
  // Подключает сервис работы с проектами.
  providers: [ProjectsService],
})
// Экспортирует модуль проектов для подключения в приложении.
export class ProjectsModule {}