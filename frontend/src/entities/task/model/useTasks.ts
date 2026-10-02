import { useEffect, useState } from 'react'
import { tasksApi } from '../api/tasks.api'
import type { CreateTaskPayload, Task, UpdateTaskPayload } from './types'

interface UseTasksResult {
  tasks: Task[]
  isLoading: boolean
  error: string
  updatingTaskIds: Set<string>
  clearError: () => void
  createTask: (payload: CreateTaskPayload) => Promise<void>
  updateTask: (taskId: string, changes: UpdateTaskPayload) => Promise<void>
  removeProjectTasks: (projectId: string) => void
}

export function useTasks(projectId: string): UseTasksResult {
  const [loadedTasks, setLoadedTasks] = useState<{ projectId: string; tasks: Task[] } | null>(null)
  const [loadError, setLoadError] = useState<{ projectId: string; message: string } | null>(null)
  const [mutationError, setMutationError] = useState<{ projectId: string; message: string } | null>(null)
  const [updatingTaskIds, setUpdatingTaskIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    if (!projectId) return

    let isCurrent = true
    tasksApi.getTasks(projectId)
      .then((tasks) => {
        if (isCurrent) setLoadedTasks({ projectId, tasks })
      })
      .catch(() => {
        if (isCurrent) setLoadError({ projectId, message: 'Не удалось загрузить задачи' })
      })

    return () => {
      isCurrent = false
    }
  }, [projectId])

  const tasks = loadedTasks?.projectId === projectId ? loadedTasks.tasks : []
  const isLoading = Boolean(projectId) && loadedTasks?.projectId !== projectId
  const error = mutationError?.projectId === projectId
    ? mutationError.message
    : loadError?.projectId === projectId ? loadError.message : ''

  async function createTask(payload: CreateTaskPayload): Promise<void> {
    setMutationError(null)
    try {
      const createdTask = await tasksApi.createTask(payload)
      setLoadedTasks((current) => current?.projectId === createdTask.projectId
        ? { ...current, tasks: [createdTask, ...current.tasks] }
        : current)
    } catch (cause) {
      setMutationError({ projectId, message: 'Не удалось создать задачу. Попробуйте ещё раз.' })
      throw cause
    }
  }

  async function updateTask(taskId: string, changes: UpdateTaskPayload): Promise<void> {
    const previousTask = tasks.find((task) => task.id === taskId)
    if (!previousTask || updatingTaskIds.has(taskId)) return

    setMutationError(null)
    setUpdatingTaskIds((current) => new Set(current).add(taskId))
    setLoadedTasks((current) => current?.projectId === projectId
      ? {
          ...current,
          tasks: current.tasks.map((task) => task.id === taskId ? { ...task, ...changes } : task),
        }
      : current)

    try {
      const updatedTask = await tasksApi.updateTask(taskId, changes)
      setLoadedTasks((current) => current?.projectId === projectId
        ? {
            ...current,
            tasks: current.tasks.map((task) => task.id === taskId ? updatedTask : task),
          }
        : current)
    } catch {
      setLoadedTasks((current) => current?.projectId === projectId
        ? {
            ...current,
            tasks: current.tasks.map((task) => task.id === taskId ? previousTask : task),
          }
        : current)
      setMutationError({ projectId, message: 'Не удалось обновить задачу. Изменение отменено.' })
    } finally {
      setUpdatingTaskIds((current) => {
        const next = new Set(current)
        next.delete(taskId)
        return next
      })
    }
  }

  function removeProjectTasks(deletedProjectId: string) {
    setLoadedTasks((current) => current?.projectId === deletedProjectId ? null : current)
  }

  return {
    tasks,
    isLoading,
    error,
    updatingTaskIds,
    clearError: () => setMutationError(null),
    createTask,
    updateTask,
    removeProjectTasks,
  }
}
