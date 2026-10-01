import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';

// Делает сервис доступным для внедрения зависимостей NestJS.
@Injectable()
export class ProjectsService {
  // Внедряет Prisma-клиент для доступа к базе данных.
  constructor(private readonly prisma: PrismaService) {}

  // Создаёт проект с данными, прошедшими проверку DTO.
  create(dto: CreateProjectDto) {
    // Отправляет Prisma команду создания записи проекта.
    return this.prisma.project.create({ data: dto });
  }

  // Возвращает проекты в порядке от новых к старым.
  findAll() {
    // Запрашивает проекты вместе с количеством связанных задач.
    return this.prisma.project.findMany({
      // Сортирует проекты по времени создания в обратном порядке.
      orderBy: { createdAt: 'desc' },
      // Добавляет число задач для каждого проекта без загрузки самих задач.
      include: { _count: { select: { tasks: true } } },
    });
  }
}