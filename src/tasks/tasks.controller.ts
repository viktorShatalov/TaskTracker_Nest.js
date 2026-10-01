import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService } from './tasks.service.js';

// Группирует маршруты задач в Swagger.
@ApiTags('tasks')
// Устанавливает базовый HTTP-путь /tasks.
@Controller('tasks')
export class TasksController {
  // Внедряет сервис, выполняющий операции с задачами.
  constructor(private readonly tasksService: TasksService) {}

  // Обрабатывает создание задачи методом POST.
  @Post()
  // Описывает создание задачи в Swagger.
  @ApiOperation({ summary: 'Создать задачу' })
  // Принимает DTO из тела запроса и передаёт его сервису.
  create(@Body() dto: CreateTaskDto) {
    // Возвращает результат создания задачи.
    return this.tasksService.create(dto);
  }

  // Обрабатывает запрос списка задач методом GET.
  @Get()
  // Описывает список задач в Swagger.
  @ApiOperation({ summary: 'Получить задачи проекта' })
  // Документирует обязательный UUID проекта в query-параметрах.
  @ApiQuery({ name: 'projectId', required: true, format: 'uuid' })
  // Проверяет формат projectId и передаёт его сервису.
  findAll(@Query('projectId', new ParseUUIDPipe()) projectId: string) {
    // Возвращает задачи выбранного проекта.
    return this.tasksService.findAll(projectId);
  }

  // Обрабатывает запрос одной задачи по её идентификатору.
  @Get(':id')
  // Описывает получение задачи в Swagger.
  @ApiOperation({ summary: 'Получить задачу по ID' })
  // Проверяет UUID в пути и запрашивает задачу через сервис.
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    // Возвращает задачу с переданным идентификатором.
    return this.tasksService.findOne(id);
  }

  // Обрабатывает частичное обновление задачи методом PATCH.
  @Patch(':id')
  // Описывает обновление задачи в Swagger.
  @ApiOperation({ summary: 'Обновить задачу' })
  // Проверяет UUID задачи и принимает поля для обновления.
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    // Передаёт идентификатор и изменения сервисному слою.
    return this.tasksService.update(id, dto);
  }

  // Обрабатывает удаление задачи методом DELETE.
  @Delete(':id')
  // Описывает удаление задачи в Swagger.
  @ApiOperation({ summary: 'Удалить задачу' })
  // Проверяет UUID и запускает удаление через сервис.
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    // Возвращает результат удаления задачи.
    return this.tasksService.remove(id);
  }
}