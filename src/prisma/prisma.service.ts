import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Позволяет внедрять Prisma Client через контейнер NestJS.
@Injectable()
// Расширяет PrismaClient и связывает его подключение с жизненным циклом Nest.
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Открывает соединение с PostgreSQL при запуске приложения.
  async onModuleInit() {
    // Устанавливает подключение, используя DATABASE_URL.
    await this.$connect();
  }

  // Закрывает соединение с PostgreSQL при остановке приложения.
  async onModuleDestroy() {
    // Освобождает ресурсы Prisma Client.
    await this.$disconnect();
  }
}