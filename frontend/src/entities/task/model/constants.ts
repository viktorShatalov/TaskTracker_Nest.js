import type { TaskPriority, TaskStatus } from './types'

export const TASK_TITLE_MAX_LENGTH = 200
export const TASK_DESCRIPTION_MAX_LENGTH = 10000

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

export const taskStatusBadgeStyles: Record<TaskStatus, string> = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-sky-100 text-sky-800',
  DONE: 'bg-emerald-100 text-emerald-800',
}

export const taskPriorityBadgeStyles: Record<TaskPriority, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-rose-100 text-rose-800',
}
