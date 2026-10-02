import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskPriority } from '../../../entities/task/model/types';
import {
  dueDateForPreset,
  formatDueDate,
  toApiDueDate,
  toDateInputValue,
} from '../../../shared/lib/date/date';
import {
  taskPriorityLabels,
  taskStatusLabels,
  taskStatusOrder,
} from '../../../entities/task/model/constants';
import {
  dueDatePresets,
  taskBoardStatusCountStyles,
  taskBoardStatusMarkerStyles,
  taskBoardStatusStyles,
  taskCardPriorityStyles,
  taskCardStatusStyles,
} from '../model/constants';
import type {
  StatusColumnProps,
  TaskBoardProps,
  TaskCardContentProps,
  TaskCardProps,
} from '../model/types';
import { TaskDetailsModal } from '../../task-details/ui/TaskDetailsModal';

function TaskCardContent({
  task,
  onPriorityChange,
  onDueDateChange,
  isUpdating = false,
}: TaskCardContentProps) {
  const [isDueDateMenuOpen, setIsDueDateMenuOpen] = useState(false);
  const dueDateMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDueDateMenuOpen) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!dueDateMenuRef.current?.contains(event.target as Node)) {
        setIsDueDateMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [isDueDateMenuOpen]);

  function saveDueDate(dueDate: string | null) {
    if (!onDueDateChange) return;
    void onDueDateChange(task.id, dueDate);
    setIsDueDateMenuOpen(false);
  }

  return (
    <div
      className={`rounded-2xl border border-white/80 p-3 shadow-sm ${taskCardStatusStyles[task.status]}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h4 className="text-xs font-bold leading-4 text-slate-900">
          {task.title}
        </h4>
        {onPriorityChange ? (
          <select
            aria-label={`Приоритет задачи: ${task.title}`}
            value={task.priority}
            disabled={isUpdating}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            onChange={(event) =>
              void onPriorityChange(task.id, event.target.value as TaskPriority)
            }
            className={[
              'shrink-0 cursor-pointer rounded-md border-0 px-2 py-1 text-[10px] font-bold uppercase tracking-wide',
              'outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-wait disabled:opacity-60',
              taskCardPriorityStyles[task.priority],
            ].join(' ')}
          >
            {Object.entries(taskPriorityLabels).map(([value, label]) => (
              <option
                key={value}
                value={value}
                className="text-[10px]"
              >
                {label}
              </option>
            ))}
          </select>
        ) : (
          <span
            className={[
              'shrink-0 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wide',
              taskCardPriorityStyles[task.priority],
            ].join(' ')}
          >
            {taskPriorityLabels[task.priority]}
          </span>
        )}
      </div>
      {task.description && (
        <p className="mb-3 line-clamp-2 text-[11px] leading-4 text-slate-500">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] font-medium text-slate-400">
        <span>
          {task.dueDate ? `до ${formatDueDate(task.dueDate)}` : 'Без срока'}
        </span>
        {onDueDateChange ? (
          <div
            ref={dueDateMenuRef}
            className="relative"
          >
            <button
              type="button"
              aria-label={`Изменить срок задачи: ${task.title}`}
              aria-haspopup="menu"
              aria-expanded={isDueDateMenuOpen}
              disabled={isUpdating}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setIsDueDateMenuOpen((isOpen) => !isOpen);
              }}
              onDoubleClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === 'Escape') setIsDueDateMenuOpen(false);
              }}
              className={[
                'rounded px-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700',
                'focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50',
              ].join(' ')}
            >
              •••
            </button>
            {isDueDateMenuOpen && (
              <div
                role="menu"
                aria-label="Выбор срока задачи"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                onDoubleClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                className={[
                  'absolute bottom-full right-0 z-30 mb-2 w-48 rounded-xl border',
                  'border-slate-200 bg-white p-1.5 text-left text-xs shadow-xl',
                ].join(' ')}
              >
                {dueDatePresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    role="menuitem"
                    disabled={isUpdating}
                    onClick={() => saveDueDate(dueDateForPreset(preset.value))}
                    className={[
                      'w-full rounded-lg px-3 py-2 text-left font-medium text-slate-700 transition',
                      'hover:bg-amber-50 hover:text-slate-950 disabled:opacity-50',
                    ].join(' ')}
                  >
                    {preset.label}
                  </button>
                ))}
                <label className="block rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-amber-50">
                  <span className="mb-1.5 block">Выбрать дату</span>
                  <input
                    type="date"
                    lang="ru"
                    value={toDateInputValue(task.dueDate)}
                    disabled={isUpdating}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) =>
                      saveDueDate(toApiDueDate(event.target.value))
                    }
                    className={[
                      'w-full rounded-md border border-slate-200 px-2 py-1 text-[10px] font-normal',
                      'outline-none focus:border-amber-400',
                    ].join(' ')}
                  />
                </label>
                <button
                  type="button"
                  role="menuitem"
                  disabled={!task.dueDate || isUpdating}
                  onClick={() => saveDueDate(null)}
                  className={[
                    'mt-1 w-full rounded-lg border-t border-slate-100 px-3 py-2 text-left',
                    'font-medium text-rose-600 transition hover:bg-rose-50',
                    'disabled:cursor-not-allowed disabled:opacity-40',
                  ].join(' ')}
                >
                  Убрать срок
                </button>
              </div>
            )}
          </div>
        ) : (
          <span aria-hidden="true">•••</span>
        )}
      </div>
    </div>
  );
}

function DraggableTaskCard({
  task,
  onOpen,
  onPriorityChange,
  onDueDateChange,
  isUpdating,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      disabled: isUpdating,
    });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        touchAction: 'none',
      }}
      {...attributes}
      {...listeners}
      role="group"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`Задача: ${task.title}`}
      title="Перетащите, чтобы сменить статус; двойной щелчок откроет подробности"
      onDoubleClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      className={[
        'group rounded-2xl transition hover:-translate-y-0.5 hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-amber-400',
        isUpdating ? 'cursor-wait opacity-60' : 'cursor-grab active:cursor-grabbing',
        isDragging ? 'opacity-30' : '',
      ].join(' ')}
    >
      <TaskCardContent
        task={task}
        onPriorityChange={onPriorityChange}
        onDueDateChange={onDueDateChange}
        isUpdating={isUpdating}
      />
    </article>
  );
}

function StatusColumn({
  status,
  tasks,
  onOpenTask,
  onPriorityChange,
  onDueDateChange,
  updatingTaskIds,
}: StatusColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={[
        'min-h-72 rounded-2xl border p-4 transition-colors',
        taskBoardStatusStyles[status],
        isOver ? 'ring-2 ring-amber-400 ring-offset-2' : '',
      ].join(' ')}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${taskBoardStatusMarkerStyles[status]}`}
          />
          <h3 className="text-xs font-bold text-slate-800">
            {taskStatusLabels[status]}
          </h3>
        </div>
        <span
          className={`rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold ${taskBoardStatusCountStyles[status]}`}
        >
          {tasks.length}
        </span>
      </div>
      <div className="min-h-48 space-y-3">
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            onOpen={() => onOpenTask(task)}
            onPriorityChange={onPriorityChange}
            onDueDateChange={onDueDateChange}
            isUpdating={updatingTaskIds.has(task.id)}
          />
        ))}
        {tasks.length === 0 && (
          <p
            className={[
              'rounded-xl border border-dashed px-3 py-8 text-center text-xs transition-colors',
              isOver ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-300 text-slate-400',
            ].join(' ')}
          >
            {isOver ? 'Переместить сюда' : 'Здесь пока пусто'}
          </p>
        )}
      </div>
    </section>
  );
}

export function TaskBoard({
  tasks,
  onStatusChange,
  onPriorityChange,
  onDueDateChange,
  updatingTaskIds,
}: TaskBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  const activeTask = tasks.find((task) => task.id === activeTaskId);

  function handleDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);
    if (!event.over) return;

    const task = tasks.find((item) => item.id === event.active.id);
    const nextStatus = taskStatusOrder.find(
      (status) => status === event.over?.id,
    );
    if (!task || !nextStatus || task.status === nextStatus) return;

    void onStatusChange(task.id, nextStatus);
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => setActiveTaskId(String(active.id))}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTaskId(null)}
      >
        <div className="grid gap-5 xl:grid-cols-3">
          {taskStatusOrder.map((status) => (
            <StatusColumn
              key={status}
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
              onOpenTask={setSelectedTask}
              onPriorityChange={onPriorityChange}
              onDueDateChange={onDueDateChange}
              updatingTaskIds={updatingTaskIds}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeTask ? <TaskCardContent task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}
