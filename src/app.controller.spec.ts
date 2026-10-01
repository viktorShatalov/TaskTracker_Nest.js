import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// Группирует unit-тесты контроллера приложения.
describe('AppController', () => {
  // Хранит экземпляр контроллера, который проверяется в тестах.
  let appController: AppController;

  // Создаёт новый тестовый модуль перед каждым тестом.
  beforeEach(async () => {
    // Собирает контроллер с настоящим сервисом приложения.
    const app: TestingModule = await Test.createTestingModule({
      // Регистрирует контроллер для тестового контейнера NestJS.
      controllers: [AppController],
      // Регистрирует зависимость, внедряемую в контроллер.
      providers: [AppService],
    // Завершает создание тестового модуля.
    }).compile();

    // Получает экземпляр контроллера из тестового контейнера.
    appController = app.get<AppController>(AppController);
  });

  // Группирует тесты корневого маршрута.
  describe('root', () => {
    // Проверяет, что контроллер возвращает приветствие.
    it('should return "Hello World!"', () => {
      // Сравнивает результат метода с ожидаемой строкой.
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
