import type { Task } from '../../../shared/api/client'
import { taskPriorityLabels, taskStatusLabels, taskStatusOrder } from '../../../entities/task/model/task'

const statusStyles = {
  TODO: 'border-slate-200 bg-slate-50',
  IN_PROGRESS: 'border-sky-200 bg-sky-50/60',
  DONE: 'border-emerald-200 bg-emerald-50/60',
}

const priorityStyles = {
  LOW: 'bg-slate-100 text-slate-500',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-rose-100 text-rose-700',
}

type TaskBoardProps = { tasks: Task[] }

export function TaskBoard({ tasks }: TaskBoardProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {taskStatusOrder.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status)
        return (
          <section key={status} className={`min-h-72 rounded-2xl border p-4 ${statusStyles[status]}`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-current opacity-70" />
                <h3 className="text-sm font-bold text-slate-800">{taskStatusLabels[status]}</h3>
              </div>
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-500">{columnTasks.length}</span>
            </div>
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <article key={task.id} className="group rounded-2xl border border-white/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h4 className="text-sm font-bold leading-5 text-slate-900">{task.title}</h4>
                    <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${priorityStyles[task.priority]}`}>
                      {taskPriorityLabels[task.priority]}
                    </span>
                  </div>
                  {task.description && <p className="mb-4 line-clamp-2 text-xs leading-5 text-slate-500">{task.description}</p>}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-400">
                    <span>{task.dueDate ? `до ${new Date(task.dueDate).toLocaleDateString('ru-RU')}` : 'Без срока'}</span>
                    <span className="opacity-0 transition group-hover:opacity-100">•••</span>
                  </div>
                </article>
              ))}
              {columnTasks.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 px-3 py-8 text-center text-xs text-slate-400">Здесь пока пусто</p>}
            </div>
          </section>
        )
      })}
    </div>
  )
}
