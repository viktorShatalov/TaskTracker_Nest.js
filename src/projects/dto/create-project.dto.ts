import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  // Показывает пример имени проекта в Swagger.
  @ApiProperty({ example: 'Website redesign' })
  // Требует строковое значение имени.
  @IsString()
  // Запрещает пустое имя.
  @MinLength(1)
  // Ограничивает имя 120 символами.
  @MaxLength(120)
  // Объявляет обязательное имя проекта.
  name!: string;

  // Показывает необязательное описание в Swagger.
  @ApiPropertyOptional({ example: 'Plan and track the redesign' })
  // Разрешает не передавать описание.
  @IsOptional()
  // Проверяет, что описание является строкой, если оно передано.
  @IsString()
  // Ограничивает описание 5000 символами.
  @MaxLength(5000)
  // Объявляет необязательное описание проекта.
  description?: string;
}