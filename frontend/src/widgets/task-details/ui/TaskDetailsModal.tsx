import {
  taskPriorityBadgeStyles,
  taskPriorityLabels,
  taskStatusBadgeStyles,
  taskStatusLabels,
} from '../../../entities/task/model/constants';
import {
  formatDueDate,
  formatTaskTimestamp,
} from '../../../shared/lib/date/date';
import { Modal } from '../../../shared/ui/modal/Modal';
import type { TaskDetailsModalProps } from '../model/types';

export function TaskDetailsModal({ task, onClose }: TaskDetailsModalProps) {
  return (
    <Modal
      ariaLabelledBy="task-details-title"
      size="screen"
      onClose={onClose}
      header={
        <>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            Подробности задачи
          </p>
          <p className="mt-1 break-all text-xs text-slate-400">ID: {task.id}</p>
        </>
      }
    >
      <main className="mx-auto grid w-full max-w-6xl gap-10 py-3 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <section>
          <div className="mb-6 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${taskStatusBadgeStyles[task.status]}`}
            >
              {taskStatusLabels[task.status]}
            </span>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${taskPriorityBadgeStyles[task.priority]}`}
            >
              Приоритет: {taskPriorityLabels[task.priority]}
            </span>
          </div>
          <h1
            id="task-details-title"
            className="max-w-4xl break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl"
          >
            {task.title}
          </h1>
          <div className="mt-10 border-t border-slate-200 pt-7">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Описание
            </h2>
            {task.description ? (
              <p className="max-w-3xl whitespace-pre-wrap break-words text-base leading-8 text-slate-700">
                {task.description}
              </p>
            ) : (
              <p className="text-sm italic text-slate-400">
                Описание не добавлено
              </p>
            )}
          </div>
        </section>

        <aside className="h-fit border-t border-slate-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Сроки
          </h2>
          <dl className="space-y-6">
            <div>
              <dt className="text-xs font-medium text-slate-400">
                Срок выполнения
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-800">
                {task.dueDate ? formatDueDate(task.dueDate) : 'Не задан'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-400">Создана</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-800">
                {formatTaskTimestamp(task.createdAt)}
              </dd>
            </div>
          </dl>
        </aside>
      </main>
    </Modal>
  );
}
