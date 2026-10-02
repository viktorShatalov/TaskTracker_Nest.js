import type { TaskPriority, TaskStatus } from '../../../entities/task/model/types'
import type { CreateTaskPayload } from '../../../entities/task/model/types'

export interface TaskFormValues {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
}

export interface TaskCreateFormProps {
  onSubmit: (payload: Omit<CreateTaskPayload, 'projectId'>) => Promise<void>
}