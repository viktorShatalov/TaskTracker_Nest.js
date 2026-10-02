import type { DueDatePreset } from './types'

export const DATE_LOCALE = 'ru'
export const DATE_FORMATS = {
  current: 'D MMMM YYYY',
  due: 'D MMM YYYY',
  taskTimestamp: 'D MMMM YYYY, HH:mm',
  dateInput: 'YYYY-MM-DD',
} as const
export const DEFAULT_DUE_DATE_HOUR = 18

export const dueDateOffsets: Record<DueDatePreset, number> = {
  today: 0,
  tomorrow: 1,
  nextWeek: 7,
}
