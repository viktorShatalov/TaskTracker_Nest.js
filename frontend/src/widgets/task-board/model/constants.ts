import type { TaskPriority, TaskStatus } from '../../../entities/task/model/types'
import type { DueDatePresetOption } from './types'

export const taskBoardStatusStyles: Record<TaskStatus, string> = {
  TODO: 'border-slate-300 bg-slate-100/80',
  IN_PROGRESS: 'border-sky-300 bg-sky-100/60',
  DONE: 'border-emerald-300 bg-emerald-100/70',
}

export const taskBoardStatusMarkerStyles: Record<TaskStatus, string> = {
  TODO: 'bg-slate-500',
  IN_PROGRESS: 'bg-sky-500',
  DONE: 'bg-emerald-500',
}

export const taskBoardStatusCountStyles: Record<TaskStatus, string> = {
  TODO: 'text-slate-600',
  IN_PROGRESS: 'text-sky-700',
  DONE: 'text-emerald-700',
}

export const taskCardStatusStyles: Record<TaskStatus, string> = {
  TODO: 'border-l-4 border-l-slate-400 bg-white',
  IN_PROGRESS: 'border-l-4 border-l-sky-500 bg-sky-50',
  DONE: 'border-l-4 border-l-emerald-500 bg-emerald-50',
}

export const taskCardPriorityStyles: Record<TaskPriority, string> = {
  LOW: 'bg-slate-100 text-slate-500',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-rose-100 text-rose-700',
}

export const dueDatePresets: DueDatePresetOption[] = [
  { value: 'today', label: 'Сегодня' },
  { value: 'tomorrow', label: 'Завтра' },
  { value: 'nextWeek', label: 'Через неделю' },
]
