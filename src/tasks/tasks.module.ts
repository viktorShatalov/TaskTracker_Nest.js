import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';

// Регистрирует маршруты и сервис задач.
@Module({
  // Подключает HTTP-контроллер задач.
  controllers: [TasksController],
  // Подключает сервис бизнес-логики задач.
  providers: [TasksService],
})
// Экспортирует модуль задач для корневого приложения.
export class TasksModule {}