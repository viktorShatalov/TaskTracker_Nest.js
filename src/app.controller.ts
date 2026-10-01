import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

// Объявляет контроллер, который обслуживает HTTP-маршруты приложения.
@Controller()
export class AppController {
  // Внедряет сервис, в котором находится логика приветствия.
  constructor(private readonly appService: AppService) {}

  // Связывает GET-запрос к корневому маршруту с методом ниже.
  @Get()
  // Возвращает строку, сформированную сервисом приложения.
  getHello(): string {
    // Передаёт получение ответа сервисному слою.
    return this.appService.getHello();
  }
}
