import type { Task, TaskPriority, TaskStatus } from '../../../entities/task/model/types'
import type { DueDatePreset } from '../../../shared/lib/date/types'

export interface TaskCardProps {
  task: Task
  onOpen: () => void
  onPriorityChange: (taskId: string, priority: TaskPriority) => Promise<void>
  onDueDateChange: (taskId: string, dueDate: string | null) => Promise<void>
  isUpdating: boolean
}

export interface TaskCardContentProps {
  task: Task
  onPriorityChange?: (taskId: string, priority: TaskPriority) => Promise<void>
  onDueDateChange?: (taskId: string, dueDate: string | null) => Promise<void>
  isUpdating?: boolean
}

export interface DueDatePresetOption {
  value: DueDatePreset
  label: string
}

export interface StatusColumnProps {
  status: TaskStatus
  tasks: Task[]
  onOpenTask: (task: Task) => void
  onPriorityChange: TaskCardProps['onPriorityChange']
  onDueDateChange: TaskCardProps['onDueDateChange']
  updatingTaskIds: ReadonlySet<string>
}

export interface TaskBoardProps {
  tasks: Task[]
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>
  onPriorityChange: TaskCardProps['onPriorityChange']
  onDueDateChange: TaskCardProps['onDueDateChange']
  updatingTaskIds: ReadonlySet<string>
}
