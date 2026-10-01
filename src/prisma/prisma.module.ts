import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// Делает PrismaService доступным во всех Nest-модулях.
@Global()
// Регистрирует сервис Prisma и экспортирует его для внедрения.
@Module({
  // Создаёт единственный PrismaService в контейнере зависимостей.
  providers: [PrismaService],
  // Разрешает другим модулям внедрять PrismaService.
  exports: [PrismaService],
})
// Объявляет модуль доступа к базе данных.
export class PrismaModule {}