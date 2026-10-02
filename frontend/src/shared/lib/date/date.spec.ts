import moment from 'moment'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { dueDateForPreset, formatCurrentDate, formatDueDate, formatTaskTimestamp, toApiDueDate, toDateInputValue } from './date'

afterEach(() => {
  moment.locale('ru')
  vi.useRealTimers()
})

describe('date helpers', () => {
  it('formats the current date with a Russian month name', () => {
    moment.locale('en')

    expect(formatCurrentDate()).toMatch(/^\d{1,2} [а-яё]+ \d{4}$/i)
  })

  it('formats due dates with Russian abbreviated month names', () => {
    moment.locale('en')

    expect(formatDueDate('2026-10-02T12:00:00.000Z')).toBe('2 окт. 2026')
  })

  it('formats task timestamps with Russian month names and 24-hour time', () => {
    moment.locale('en')

    expect(formatTaskTimestamp('2026-10-15T12:05:00.000Z')).toMatch(
      /^\d{1,2} октября 2026, \d{2}:\d{2}$/,
    )
  })

  it('converts date input to 18:00 local time as an ISO string', () => {
    const result = toApiDueDate('2026-10-02')

    expect(result).not.toBeNull()
    expect(moment(result).format('YYYY-MM-DD HH:mm')).toBe('2026-10-02 18:00')
  })

  it('builds today, tomorrow, and next-week due date presets', () => {
    vi.useFakeTimers()
    vi.setSystemTime(moment('2026-10-02 10:00', 'YYYY-MM-DD HH:mm').toDate())

    expect(moment(dueDateForPreset('today')).format('YYYY-MM-DD HH:mm')).toBe('2026-10-02 18:00')
    expect(moment(dueDateForPreset('tomorrow')).format('YYYY-MM-DD HH:mm')).toBe('2026-10-03 18:00')
    expect(moment(dueDateForPreset('nextWeek')).format('YYYY-MM-DD HH:mm')).toBe('2026-10-09 18:00')
  })

  it('formats existing due dates for the date input', () => {
    expect(toDateInputValue('2026-10-02T15:00:00.000Z')).toMatch(/^2026-10-0[23]$/)
    expect(toDateInputValue(null)).toBe('')
  })

  it('returns null for empty or invalid date input', () => {
    expect(toApiDueDate('')).toBeNull()
    expect(toApiDueDate('2026-02-30')).toBeNull()
  })
})
