import type { ModalSize } from './types'

export const modalSizeStyles: Record<ModalSize, string> = {
  compact: 'max-h-[90vh] w-[calc(100%-2rem)] max-w-md',
  wide: 'max-h-[90vh] w-[calc(100%-2rem)] max-w-4xl',
  screen: 'h-[95vh] h-[95dvh] w-[95vw] max-h-none max-w-none',
}
