import { useEffect, useMemo, useState } from 'react'
import { api, type CreateTaskPayload, type Project, type Task } from '../../../shared/api/client'
import { TaskCreateForm } from '../../../features/task-create/ui/TaskCreateForm'
import { TaskBoard } from '../../../widgets/task-board/ui/TaskBoard'

type DashboardPageProps = {
  onProjectCountChange?: (count: number) => void
}

export function DashboardPage({ onProjectCountChange }: DashboardPageProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
  const [isCreatingProject, setIsCreatingProject] = useState(false)

  const activeProject = useMemo(() => projects.find((project) => project.id === activeProjectId), [projects, activeProjectId])
  const visibleTasks = tasks.filter((task) => task.projectId === activeProjectId)

  useEffect(() => {
    api.getProjects()
      .then((loadedProjects) => {
        setProjects(loadedProjects)
        setActiveProjectId(loadedProjects[0]?.id ?? '')
        onProjectCountChange?.(loadedProjects.length)
      })
      .catch(() => setError('Не удалось загрузить проекты'))
      .finally(() => setIsLoading(false))
  }, [onProjectCountChange])

  useEffect(() => {
    if (!activeProjectId) return
    api.getTasks(activeProjectId).then(setTasks).catch(() => setError('Не удалось загрузить задачи'))
  }, [activeProjectId])

  async function handleCreateTask(payload: Omit<CreateTaskPayload, 'projectId'>) {
    if (!activeProjectId) return
    const task = await api.createTask({ ...payload, projectId: activeProjectId })
    setTasks((currentTasks) => [task, ...currentTasks])
  }

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newProjectName.trim()) return
    setIsCreatingProject(true)
    try {
      const project = await api.createProject({ name: newProjectName.trim() })
      setProjects((currentProjects) => [...currentProjects, project])
      setActiveProjectId(project.id)
      setNewProjectName('')
      onProjectCountChange?.(projects.length + 1)
    } finally {
      setIsCreatingProject(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
      <aside className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-200/60">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-400 text-lg font-black text-slate-950">T</div>
          <div><p className="text-sm font-bold">Taskflow</p><p className="text-[11px] text-slate-500">рабочее пространство</p></div>
        </div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Проекты</p>
        <div className="space-y-1">
          {projects.map((project) => (
            <button key={project.id} onClick={() => setActiveProjectId(project.id)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${activeProjectId === project.id ? 'bg-white text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <span className="truncate">{project.name}</span>
              <span className="text-xs opacity-50">{project._count?.tasks ?? ''}</span>
            </button>
          ))}
        </div>
        <form onSubmit={handleCreateProject} className="mt-6 border-t border-slate-800 pt-5">
          <label className="mb-2 block text-xs font-semibold text-slate-500" htmlFor="new-project">Новый проект</label>
          <div className="flex gap-2">
            <input id="new-project" value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} placeholder="Название" className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-400" />
            <button disabled={isCreatingProject} aria-label="Создать проект" className="rounded-lg bg-amber-400 px-3 text-lg font-bold text-slate-950 hover:bg-amber-300">+</button>
          </div>
        </form>
      </aside>

      <main className="min-w-0">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Обзор проекта</p><h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{activeProject?.name ?? 'Ваши проекты'}</h1><p className="mt-2 text-sm text-slate-500">Соберите фокус команды в одном месте.</p></div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Синхронизировано</div>
        </header>
        {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
        {isLoading ? <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">Загружаем рабочее пространство...</div> : <TaskBoard tasks={visibleTasks} />}
      </main>

      <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Быстрое действие</p><h2 className="mt-2 text-xl font-black text-slate-950">Добавить задачу</h2><p className="mt-1 text-xs leading-5 text-slate-500">Она сразу появится в выбранном проекте.</p></div>
        {activeProjectId ? <TaskCreateForm onSubmit={handleCreateTask} /> : <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">Создайте или выберите проект слева, чтобы добавить первую задачу.</p>}
      </aside>
    </div>
  )
}
