import { apiClient } from '../../../shared/api/axios'
import type { CreateProjectPayload, Project, UpdateProjectPayload } from '../model/types'

export const projectsApi = {
  getProjects: async () => (await apiClient.get<Project[]>('/projects')).data,
  createProject: async (payload: CreateProjectPayload) =>
    (await apiClient.post<Project>('/projects', payload)).data,
  updateProject: async (projectId: string, payload: UpdateProjectPayload) =>
    (await apiClient.patch<Project>(`/projects/${encodeURIComponent(projectId)}`, payload)).data,
  deleteProject: async (projectId: string) =>
    (await apiClient.delete<{ deleted: boolean }>(`/projects/${encodeURIComponent(projectId)}`)).data,
}