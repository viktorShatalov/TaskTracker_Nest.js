import type { Task } from '../../../entities/task/model/types'

export interface TaskDetailsModalProps {
  task: Task
  onClose: () => void
}
