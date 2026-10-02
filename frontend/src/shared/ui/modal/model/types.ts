import type { ReactNode, RefObject } from 'react'

export type ModalSize = 'compact' | 'wide' | 'screen'

export interface ModalProps {
  ariaLabelledBy: string
  header: ReactNode
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
  size?: ModalSize
  closeDisabled?: boolean
  initialFocusRef?: RefObject<HTMLElement | null>
}
