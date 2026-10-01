import { Injectable } from '@nestjs/common';

// Позволяет внедрять сервис в другие компоненты NestJS.
@Injectable()
export class AppService {
  // Возвращает приветственное сообщение приложения.
  getHello(): string {
    // Формирует строковый ответ корневого маршрута.
    return 'Hello World!';
  }
}
