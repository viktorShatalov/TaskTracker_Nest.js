import moment from 'moment'
import { DATE_FORMATS, DATE_LOCALE, DEFAULT_DUE_DATE_HOUR, dueDateOffsets } from './constants'
import type { DueDatePreset } from './types'
// Moment locale bundles are JavaScript-only and have no per-locale declarations.
// @ts-expect-error Moment ships Russian locale data without TypeScript declarations.
import 'moment/locale/ru'

moment.locale(DATE_LOCALE)

export function formatCurrentDate(): string {
  return moment().locale(DATE_LOCALE).format(DATE_FORMATS.current)
}

export function formatDueDate(value: string): string {
  return moment(value).locale(DATE_LOCALE).format(DATE_FORMATS.due)
}

export function formatTaskTimestamp(value: string): string {
  return moment(value).locale(DATE_LOCALE).format(DATE_FORMATS.taskTimestamp)
}

export function dueDateForPreset(preset: DueDatePreset): string {
  return moment().startOf('day').add(dueDateOffsets[preset], 'days').hour(DEFAULT_DUE_DATE_HOUR).toISOString()
}

export function toDateInputValue(value?: string | null): string {
  return value ? moment(value).format(DATE_FORMATS.dateInput) : ''
}

export function toApiDueDate(value: string): string | null {
  if (!value) return null

  const date = moment(value, DATE_FORMATS.dateInput, true)
  return date.isValid() ? date.hour(DEFAULT_DUE_DATE_HOUR).toISOString() : null
}