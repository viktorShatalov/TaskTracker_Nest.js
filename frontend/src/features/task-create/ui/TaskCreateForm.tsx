import { useState, type FormEvent } from 'react'
import type { CreateTaskPayload, TaskPriority, TaskStatus } from '../../../shared/api/client'
import { taskPriorityLabels, taskStatusLabels } from '../../../entities/task/model/task'

type TaskCreateFormProps = {
  onSubmit: (payload: Omit<CreateTaskPayload, 'projectId'>) => Promise<void>
}

export function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [status, setStatus] = useState<TaskStatus>('TODO')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        dueDate: dueDate ? new Date(`${dueDate}T18:00:00`).toISOString() : null,
      })
      setTitle('')
      setDescription('')
      setDueDate('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" htmlFor="task-title">
          Новая задача
        </label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Что нужно сделать?"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          maxLength={200}
          required
        />
      </div>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Добавьте контекст или критерии готовности"
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs font-semibold text-slate-500">
          Приоритет
          <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-amber-400">
            {Object.entries(taskPriorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-500">
          Статус
          <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-amber-400">
            {Object.entries(taskStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
      <label className="block text-xs font-semibold text-slate-500">
        Срок
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-amber-400" />
      </label>
      <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-slate-950 disabled:cursor-wait disabled:opacity-60">
        <span className="text-lg leading-none">+</span>
        {isSubmitting ? 'Сохраняем...' : 'Добавить задачу'}
      </button>
    </form>
  )
}
