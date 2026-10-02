import { useRef } from 'react';
import { Modal } from '../../../shared/ui/modal/Modal';
import type { ProjectDeleteModalProps } from '../model/types';

export function ProjectDeleteModal({
  project,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: ProjectDeleteModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      ariaLabelledBy="delete-project-title"
      size="compact"
      onClose={onClose}
      closeDisabled={isDeleting}
      initialFocusRef={cancelButtonRef}
      header={
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-rose-700"
            aria-hidden="true"
          >
            !
          </span>
          <h2
            id="delete-project-title"
            className="text-lg font-bold"
          >
            Удалить проект?
          </h2>
        </div>
      }
      footer={
        <>
          <button
            ref={cancelButtonRef}
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className={[
              'rounded-lg border border-slate-200 bg-white px-4 py-2',
              'text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50',
            ].join(' ')}
          >
            Отмена
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => void onConfirm()}
            className={[
              'rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white',
              'transition hover:bg-rose-700 disabled:cursor-wait disabled:opacity-60',
            ].join(' ')}
          >
            {isDeleting ? 'Удаляем...' : 'Удалить проект'}
          </button>
        </>
      }
    >
      <p className="mt-2 break-words text-sm leading-6 text-slate-600">
        Проект «{project.name}» будет удалён.{' '}
        {project._count?.tasks
          ? `Вместе с ним будут безвозвратно удалены задачи: ${project._count.tasks}. `
          : 'Все связанные задачи также будут удалены. '}
        Это действие нельзя отменить.
      </p>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          {error}
        </p>
      )}
    </Modal>
  );
}
