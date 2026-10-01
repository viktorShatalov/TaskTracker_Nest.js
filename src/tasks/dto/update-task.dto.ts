import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto.js';

// Делает поля DTO создания необязательными для частичного обновления.
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}