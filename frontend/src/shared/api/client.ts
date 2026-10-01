const apiBase = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const api = {
  getProjects: () => request<Project[]>('/projects'),
  createProject: (payload: { name: string; description?: string }) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getTasks: (projectId: string) =>
    request<Task[]>(`/tasks?projectId=${encodeURIComponent(projectId)}`),
  createTask: (payload: CreateTaskPayload) =>
    request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

export type Project = {
  id: string
  name: string
  description?: string | null
  _count?: { tasks: number }
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type Task = {
  id: string
  projectId: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
  createdAt: string
}

export type CreateTaskPayload = {
  projectId: string
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
}
