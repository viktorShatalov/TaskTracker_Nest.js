import { TASK_TITLE_MAX_LENGTH } from '../../../entities/task/model/constants'

export function validateTaskTitle(value: string | undefined): string | undefined {
  if (!value?.trim()) return 'Введите название задачи'
  if (value.trim().length > TASK_TITLE_MAX_LENGTH) {
    return `Название задачи не должно превышать ${TASK_TITLE_MAX_LENGTH} символов`
  }
  return undefined
}
