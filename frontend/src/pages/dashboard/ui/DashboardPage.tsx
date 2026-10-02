import { useMemo, useState, type FormEvent } from 'react';
import { useProjects } from '../../../entities/project/model/useProjects';
import { PROJECT_NAME_MAX_LENGTH } from '../../../entities/project/model/constants';
import type { Project } from '../../../entities/project/model/types';
import type { CreateTaskPayload } from '../../../entities/task/model/types';
import { useTasks } from '../../../entities/task/model/useTasks';
import { TaskCreateForm } from '../../../features/task-create/ui/TaskCreateForm';
import { ProjectCreateForm } from '../../../features/project-create/ui/ProjectCreateForm';
import type { ProjectCreateValues } from '../../../features/project-create/model/types';
import { ProjectDeleteModal } from '../../../features/project-delete/ui/ProjectDeleteModal';
import { TaskBoard } from '../../../widgets/task-board/ui/TaskBoard';
import type { DashboardPageProps } from '../model/types';

export function DashboardPage({ onProjectCountChange }: DashboardPageProps) {
  const {
    projects,
    activeProjectId,
    setActiveProjectId,
    isLoading: isLoadingProjects,
    error: projectError,
    clearError: clearProjectError,
    isDeleting: isDeletingProject,
    updatingProjectIds,
    createProject,
    updateProjectName,
    deleteProject,
  } = useProjects({ onProjectCountChange });
  const {
    tasks,
    isLoading: isLoadingTasks,
    error: taskError,
    clearError: clearTaskError,
    updatingTaskIds,
    createTask,
    updateTask,
    removeProjectTasks,
  } = useTasks(activeProjectId);
  const [actionError, setActionError] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectNameDraft, setProjectNameDraft] = useState('');

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId),
    [projects, activeProjectId],
  );
  const isSavingProjectName = Boolean(
    activeProject && updatingProjectIds.has(activeProject.id),
  );
  const visibleTasks = tasks;
  const isLoading = isLoadingProjects || isLoadingTasks;
  const error = actionError || projectError || taskError;

  function clearErrors() {
    setActionError('');
    clearProjectError();
    clearTaskError();
  }

  async function handleCreateTask(
    payload: Omit<CreateTaskPayload, 'projectId'>,
  ) {
    if (!activeProjectId) return;
    await createTask({ ...payload, projectId: activeProjectId });
  }

  async function handleTaskUpdate(
    taskId: string,
    changes: Parameters<typeof updateTask>[1],
  ) {
    await updateTask(taskId, changes);
  }

  async function handleCreateProject(values: ProjectCreateValues) {
    await createProject(values);
  }

  function handleStartProjectRename() {
    if (!activeProject) return;
    clearErrors();
    setProjectNameDraft(activeProject.name);
    setEditingProjectId(activeProject.id);
  }

  function handleCancelProjectRename() {
    setEditingProjectId(null);
    setProjectNameDraft(activeProject?.name ?? '');
  }

  async function handleSaveProjectName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !activeProject ||
      editingProjectId !== activeProject.id ||
      isSavingProjectName
    )
      return;

    const nextName = projectNameDraft.trim();
    if (!nextName) {
      setActionError('Название проекта не может быть пустым.');
      return;
    }
    if (nextName === activeProject.name) {
      setEditingProjectId(null);
      return;
    }

    clearErrors();
    if (await updateProjectName(activeProject.id, nextName))
      setEditingProjectId(null);
  }

  async function handleDeleteProject() {
    if (!projectToDelete || isDeletingProject) return;
    clearErrors();
    if (await deleteProject(projectToDelete.id)) {
      removeProjectTasks(projectToDelete.id);
      setProjectToDelete(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
      <aside className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-200/60">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-400 text-lg font-black text-slate-950">
            T
          </div>
          <div>
            <p className="text-sm font-bold">Taskflow</p>
            <p className="text-[11px] text-slate-500">рабочее пространство</p>
          </div>
        </div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Проекты
        </p>
        <div className="space-y-1">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex items-center gap-1"
            >
              <button
                onClick={() => {
                  setEditingProjectId(null);
                  setActiveProjectId(project.id);
                }}
                className={[
                  'flex min-w-0 flex-1 items-center justify-between rounded-xl px-3 py-2.5',
                  'text-left text-sm transition',
                  activeProjectId === project.id
                    ? 'bg-white text-slate-950'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                ].join(' ')}
              >
                <span className="truncate">{project.name}</span>
                <span className="ml-2 text-xs opacity-50">
                  {project._count?.tasks ?? ''}
                </span>
              </button>
              <button
                type="button"
                aria-label={`Удалить проект ${project.name}`}
                title={`Удалить проект ${project.name}`}
                onClick={() => {
                  clearErrors();
                  setProjectToDelete(project);
                }}
                className={[
                  'grid h-8 w-8 shrink-0 place-items-center rounded-lg text-lg text-slate-500 opacity-0 transition',
                  'hover:bg-rose-500/15 hover:text-rose-300 focus:opacity-100',
                  'focus:outline-none focus:ring-2 focus:ring-rose-400 group-hover:opacity-100',
                ].join(' ')}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <ProjectCreateForm onSubmit={handleCreateProject} />
      </aside>

      <main className="min-w-0">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
              Обзор проекта
            </p>
            {activeProject && editingProjectId === activeProject.id ? (
              <form
                onSubmit={handleSaveProjectName}
                className="flex items-center gap-2"
              >
                <input
                  autoFocus
                  aria-label="Название проекта"
                  value={projectNameDraft}
                  maxLength={PROJECT_NAME_MAX_LENGTH}
                  disabled={isSavingProjectName}
                  onChange={(event) => setProjectNameDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape' && !isSavingProjectName)
                      handleCancelProjectRename();
                  }}
                  className={[
                    'min-w-0 max-w-full rounded-lg border border-amber-300 bg-white px-2 py-1',
                    'text-2xl font-black tracking-tight text-slate-950 outline-none',
                    'focus:ring-2 focus:ring-amber-400 sm:text-3xl',
                  ].join(' ')}
                />
                <button
                  type="submit"
                  aria-label="Сохранить название"
                  title="Сохранить"
                  disabled={isSavingProjectName}
                  className={[
                    'grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-100',
                    'text-lg font-bold text-emerald-700 hover:bg-emerald-200 disabled:opacity-50',
                  ].join(' ')}
                >
                  ✓
                </button>
                <button
                  type="button"
                  aria-label="Отменить переименование"
                  title="Отмена"
                  disabled={isSavingProjectName}
                  onClick={handleCancelProjectRename}
                  className={[
                    'grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100',
                    'text-lg text-slate-600 hover:bg-slate-200 disabled:opacity-50',
                  ].join(' ')}
                >
                  ×
                </button>
              </form>
            ) : (
              <h1
                onDoubleClick={handleStartProjectRename}
                title={
                  activeProject
                    ? 'Дважды щёлкните, чтобы изменить название'
                    : undefined
                }
                className={[
                  'w-fit max-w-full cursor-text break-words rounded-md',
                  'text-3xl font-black tracking-tight text-slate-950 sm:text-4xl',
                ].join(' ')}
              >
                {activeProject?.name ?? 'Ваши проекты'}
              </h1>
            )}
            <p className="mt-2 text-sm text-slate-500">
              Соберите фокус команды в одном месте.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />{' '}
            Синхронизировано
          </div>
        </header>
        {error && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
            Загружаем рабочее пространство...
          </div>
        ) : (
          <TaskBoard
            tasks={visibleTasks}
            onStatusChange={(taskId, status) =>
              handleTaskUpdate(taskId, { status })
            }
            onPriorityChange={(taskId, priority) =>
              handleTaskUpdate(taskId, { priority })
            }
            onDueDateChange={(taskId, dueDate) =>
              handleTaskUpdate(taskId, { dueDate })
            }
            updatingTaskIds={updatingTaskIds}
          />
        )}
      </main>

      <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            Быстрое действие
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950">
            Добавить задачу
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Она сразу появится в выбранном проекте.
          </p>
        </div>
        {activeProjectId ? (
          <TaskCreateForm onSubmit={handleCreateTask} />
        ) : (
          <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
            Создайте или выберите проект слева, чтобы добавить первую задачу.
          </p>
        )}
      </aside>
      {projectToDelete && (
        <ProjectDeleteModal
          project={projectToDelete}
          isDeleting={isDeletingProject}
          error={error}
          onClose={() => setProjectToDelete(null)}
          onConfirm={handleDeleteProject}
        />
      )}
    </div>
  );
}
