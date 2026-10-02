import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { TASK_DESCRIPTION_MAX_LENGTH, TASK_TITLE_EXAMPLE, TASK_TITLE_MAX_LENGTH } from '../tasks.constants.js';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

// Описывает и проверяет поля для создания задачи.
export class CreateTaskDto {
  // Документирует идентификатор проекта в Swagger.
  @ApiProperty({ format: 'uuid' })
  // Требует корректный UUID проекта.
  @IsUUID()
  // Объявляет обязательный идентификатор проекта.
  projectId!: string;

  // Показывает пример заголовка задачи в Swagger.
  @ApiProperty({ example: TASK_TITLE_EXAMPLE })
  // Требует строковый заголовок.
  @IsString()
  // Запрещает пустой заголовок.
  @MinLength(1)
  // Ограничивает заголовок 200 символами.
  @MaxLength(TASK_TITLE_MAX_LENGTH)
  // Объявляет обязательный заголовок задачи.
  title!: string;

  // Документирует необязательное описание в Swagger.
  @ApiPropertyOptional()
  // Разрешает пропустить описание.
  @IsOptional()
  // Проверяет строковый тип описания.
  @IsString()
  @MaxLength(TASK_DESCRIPTION_MAX_LENGTH)
  // Объявляет необязательное описание задачи.
  description?: string;

  // Документирует допустимые статусы задачи.
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  // Ограничивает значение вариантами TaskStatus.
  @IsEnum(TaskStatus)
  // Объявляет необязательный статус задачи.
  status?: TaskStatus;

  // Документирует допустимые приоритеты задачи.
  @ApiPropertyOptional({ enum: TaskPriority })
  // Разрешает пропустить приоритет.
  // Ограничивает значение вариантами TaskPriority.
  @IsEnum(TaskPriority)
  // Объявляет необязательный приоритет задачи.
  priority?: TaskPriority;

  // Документирует срок как дату и время в Swagger.
  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  // Разрешает пропустить срок или передать null.
  @IsOptional()
  // Проверяет формат строки даты.
  @IsDateString()
  // Объявляет необязательный срок выполнения.
  dueDate?: string | null;
}