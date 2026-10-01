import type { TaskPriority, TaskStatus } from '../../../shared/api/client'

export const taskStatusLabels: Record<TaskStatus, string> = {
  TODO: 'К исполнению',
  IN_PROGRESS: 'В работе',
  DONE: 'Готово',
}

export const taskPriorityLabels: Record<TaskPriority, string> = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
  URGENT: 'Срочный',
}

export const taskStatusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']
