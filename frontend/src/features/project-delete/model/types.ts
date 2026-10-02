import type { Project } from '../../../entities/project/model/types'

export interface ProjectDeleteModalProps {
  project: Project
  isDeleting: boolean
  error: string
  onClose: () => void
  onConfirm: () => Promise<void>
}
