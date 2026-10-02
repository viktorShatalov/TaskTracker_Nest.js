import { useEffect, useRef } from 'react';
import { modalSizeStyles } from './model/constants';
import type { ModalProps } from './model/types';

export function Modal({
  ariaLabelledBy,
  header,
  children,
  footer,
  onClose,
  size = 'compact',
  closeDisabled = false,
  initialFocusRef,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    (initialFocusRef?.current ?? closeButtonRef.current)?.focus();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [initialFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={ariaLabelledBy}
      onCancel={(event) => {
        event.preventDefault();
        if (!closeDisabled) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !closeDisabled) onClose();
      }}
      className={[
        'inset-0 m-auto flex flex-col overflow-hidden rounded-2xl border-0 bg-white p-0',
        'text-slate-950 shadow-2xl ring-1 ring-black/10 backdrop:bg-slate-950/65',
        modalSizeStyles[size],
      ].join(' ')}
    >
      <header className="flex shrink-0 items-start justify-between gap-5 border-b border-slate-200 px-6 py-5">
        <div className="min-w-0 flex-1">{header}</div>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Закрыть окно"
          disabled={closeDisabled}
          onClick={onClose}
          className={[
            'grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200',
            'text-xl leading-none text-slate-500 transition hover:border-slate-950 hover:text-slate-950',
            'focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-wait disabled:opacity-50',
          ].join(' ')}
        >
          ×
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
      {footer && (
        <footer className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          {footer}
        </footer>
      )}
    </dialog>
  );
}
