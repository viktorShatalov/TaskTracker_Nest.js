import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectsService } from './projects.service.js';

// Группирует маршруты проектов в Swagger.
@ApiTags('projects')
// Устанавливает базовый HTTP-путь /projects.
@Controller('projects')
export class ProjectsController {
  // Внедряет сервис, выполняющий операции с проектами.
  constructor(private readonly projectsService: ProjectsService) {}

  // Обрабатывает создание проекта методом POST.
  @Post()
  // Описывает операцию создания в Swagger.
  @ApiOperation({ summary: 'Создать проект' })
  // Передаёт проверенное тело запроса сервису.
  create(@Body() dto: CreateProjectDto) {
    // Возвращает результат создания проекта.
    return this.projectsService.create(dto);
  }

  // Обрабатывает получение списка проектов методом GET.
  @Get()
  // Описывает операцию получения списка в Swagger.
  @ApiOperation({ summary: 'Получить список проектов' })
  // Вызывает сервисный метод без параметров.
  findAll() {
    // Возвращает найденные проекты.
    return this.projectsService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить проект' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить проект вместе с его задачами' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.projectsService.remove(id);
  }
}