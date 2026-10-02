import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import {
  PROJECT_DESCRIPTION_EXAMPLE,
  PROJECT_DESCRIPTION_MAX_LENGTH,
  PROJECT_NAME_EXAMPLE,
  PROJECT_NAME_MAX_LENGTH,
} from '../projects.constants.js';

export class CreateProjectDto {
  // Показывает пример имени проекта в Swagger.
  @ApiProperty({ example: PROJECT_NAME_EXAMPLE })
  // Требует строковое значение имени.
  @IsString()
  // Запрещает пустое имя.
  @MinLength(1)
  // Ограничивает имя 120 символами.
  @MaxLength(PROJECT_NAME_MAX_LENGTH)
  // Объявляет обязательное имя проекта.
  name!: string;

  // Показывает необязательное описание в Swagger.
  @ApiPropertyOptional({ example: PROJECT_DESCRIPTION_EXAMPLE })
  // Разрешает не передавать описание.
  @IsOptional()
  // Проверяет, что описание является строкой, если оно передано.
  @IsString()
  // Ограничивает описание 5000 символами.
  @MaxLength(PROJECT_DESCRIPTION_MAX_LENGTH)
  // Объявляет необязательное описание проекта.
  description?: string;
}