import { Injectable, NotFoundException } from '@nestjs/common';
import { toPrismaDate } from '../shared/date/date.utils.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

// Предоставляет операции CRUD для задач.
@Injectable()
export class TasksService {
  // Внедряет Prisma для взаимодействия с PostgreSQL.
  constructor(private readonly prisma: PrismaService) {}

  // Создаёт задачу с преобразованием срока в объект Date.
  async create(dto: CreateTaskDto) {
    // Проверяет, что задача будет привязана к существующему проекту.
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      select: { id: true },
    });
    // Возвращает HTTP 404, если проект не найден.
    if (!project) throw new NotFoundException('Проект не найден');

    // Создаёт задачу и сохраняет пустой срок как null.
    return this.prisma.task.create({
      data: {
        ...dto,
        dueDate: toPrismaDate(dto.dueDate),
      },
    });
  }

  // Возвращает задачи выбранного проекта.
  findAll(projectId: string) {
    // Сначала показывает задачи с ближайшим сроком, затем новые.
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    });
  }

  // Ищет одну задачу и сообщает 404, если её нет.
  async findOne(id: string) {
    // Ищет запись по первичному ключу.
    const task = await this.prisma.task.findUnique({ where: { id } });
    // Преобразует отсутствие записи в понятный HTTP-ответ.
    if (!task) throw new NotFoundException('Задача не найдена');
    // Возвращает найденную задачу.
    return task;
  }

  // Частично обновляет задачу после проверки её существования.
  async update(id: string, dto: UpdateTaskDto) {
    // Проверяет наличие задачи до вызова обновления.
    await this.findOne(id);
    // Отделяет дату, чтобы привести строку DTO к типу Date Prisma.
    const { dueDate, ...data } = dto;
    // Сохраняет переданные поля и преобразованный срок выполнения.
    return this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        ...(dueDate !== undefined
          ? { dueDate: toPrismaDate(dueDate) }
          : {}),
      },
    });
  }

  // Удаляет задачу после проверки её существования.
  async remove(id: string) {
    // Проверяет, что задача существует.
    await this.findOne(id);
    // Удаляет задачу из PostgreSQL.
    await this.prisma.task.delete({ where: { id } });
    // Возвращает короткое подтверждение удаления.
    return { deleted: true };
  }
}