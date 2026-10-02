import { PROJECT_NAME_MAX_LENGTH } from '../../../entities/project/model/constants'

export function validateProjectName(value: string | undefined): string | undefined {
  if (!value?.trim()) return 'Введите название проекта'
  if (value.trim().length > PROJECT_NAME_MAX_LENGTH) {
    return `Название проекта не должно превышать ${PROJECT_NAME_MAX_LENGTH} символов`
  }
  return undefined
}
