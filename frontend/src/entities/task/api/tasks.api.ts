import { apiClient } from '../../../shared/api/axios'
import type { CreateTaskPayload, Task, UpdateTaskPayload } from '../model/types'

export const tasksApi = {
  getTasks: async (projectId: string) =>
    (await apiClient.get<Task[]>('/tasks', { params: { projectId } })).data,
  createTask: async (payload: CreateTaskPayload) =>
    (await apiClient.post<Task>('/tasks', payload)).data,
  updateTask: async (taskId: string, payload: UpdateTaskPayload) =>
    (await apiClient.patch<Task>(`/tasks/${encodeURIComponent(taskId)}`, payload)).data,
}